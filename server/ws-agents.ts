import {Socket} from "socket.io";
import {db} from "./sqlite-connector";
import {agent, invitation, question} from "./sqlite-schemas";
import {eq} from "drizzle-orm";
import OpenAI from "openai";
import {OpenAIEmbeddings} from "@langchain/openai";
import {SQLiteTable} from "drizzle-orm/sqlite-core/table";
import { randomUUID } from 'crypto'
import {openai} from "./openai-connector";
import {ChatCompletionStream} from "openai/src/lib/ChatCompletionStream";

let activeWs = {};

const __EMBEDDINGS__ = 'text-embedding-3-small'
const __GPT_MODEL__ = 'gpt-4o-mini'

const embeddings = new OpenAIEmbeddings({
    model: __EMBEDDINGS__
})

type AgentResponse = {
    message: string,
    socketId?: string,
    agentId: string,
    messageIndex: string
}

type Agent = {
    id: string,
    createdAt: string,
    description: string,
    name: string,
    priority: number,
    invitationId: string
}

type Question = {id:string, createdAt: string, used: boolean, text: string, agent: string, invitationId: string}

export const linkAgentWsConnection = async(socket: Socket, handshakeToken: string) => {
    console.log(`ws agent ${socket.id} connected to ${socket.nsp.name || 'default namespace'} with handshake token: ${handshakeToken}` );
    activeWs[socket.id] = socket;
    console.log(`active agents: ${Object.keys(activeWs).length}`);

    const msg = { message: 'Connection successful!', socketId: socket.id, type: 'response' }
    socket.emit('response', msg);


    const invitations = await db.select().from(invitation as SQLiteTable).where(eq(invitation.id, "bf61b5eb-25d9-445a-8d54-de1e4caf046c")).all()
    const agents: Agent[] = await db.select().from(agent as SQLiteTable).where(eq(agent.invitationId, "bf61b5eb-25d9-445a-8d54-de1e4caf046c")).all()
    const questions: Question[] = await db.select().from(question as SQLiteTable).where(eq(question.invitationId, "bf61b5eb-25d9-445a-8d54-de1e4caf046c")).all()

    let lastUsedAgent = agents.sort((a, b) => a.priority - b.priority)[0].id

    const arbiterAgent = spawnArbiterAgent(socket, agents)

    for (const agentCfg of agents) {
        console.log(`Spawning agent ${agentCfg.name} with id ${agentCfg.id}`)
        const agent = await spawnAiAgent(socket, questions, agentCfg)

        socket.on('message', async (msg) => {
            const arbiterResponse = await arbiterAgent.identifyAppropriateAgent(msg)
            console.log('arbiter response', arbiterResponse)
            if(arbiterResponse?.agentId === agentCfg.id) {
                lastUsedAgent = agentCfg.id
                agent.prompt(msg)
            }else {
                if(agentCfg.id === lastUsedAgent) {
                    lastUsedAgent = agentCfg.id
                    console.log(`Switching agent to last used: ${lastUsedAgent}`)
                    agent.prompt(msg)
                }
            }
        });
    }

    socket.on('message', (msg) => {
        socket.emit('response', {message:msg});
    })

    socket.on('disconnect', () => {
        console.log(`ws ${socket.id} disconnected`);
    });

    socket.on('error', (err) => {
        console.error('ws error', err);
    });
}

const spawnArbiterAgent = (socket: Socket, agents: Agent[]) => {
    const ctx: OpenAI.Chat.Completions.ChatCompletionMessageParam[]  = []

    ctx.push({
        role: 'system',
        content: `You are arbiter agent which resolves which agent to use based on user input. You have the following agents available: ${JSON.stringify(agents)}`
    })

    return {
        identifyAppropriateAgent: async (text: string) => {
            const stream: ChatCompletionStream<unknown> = await  openai.beta.chat.completions.stream({
                model: __GPT_MODEL__,
                messages: [...ctx, {role: 'user', content: `${text}`}],
                stream: true,
                tools: [{
                    type: 'function',
                    function: {
                        name: 'identifyAppropriateAgent',
                        description: `gets the most appropriate agent based on user input`,
                        parameters: {
                            type: 'object',
                            properties: {
                                agentId: {
                                    type: 'string',
                                    description: 'agent id'
                                },
                                agentName: {
                                    type: 'string',
                                    description: 'agent name'
                                }
                            },
                            required: ['agentId', 'agentName']
                        }
                    },
                }]
            });


            const chatCompletion = await stream.finalChatCompletion();


            const invokeToolCalling = chatCompletion.choices[0].finish_reason === 'tool_calls'


            if(invokeToolCalling) {
                const toolFn =  chatCompletion.choices[0].message.tool_calls[0];
                const args = JSON.parse(toolFn.function.arguments)

                return {agentId: args.agentId, agentName: args.name}
            }
            return null
        }
    }
}

const spawnAiAgent = (socket: Socket, questions: Question[], cfg: Agent) => {
    const agentId = cfg.id

    const ctx: OpenAI.Chat.Completions.ChatCompletionMessageParam[]  = []

    ctx.push({
        role: 'system',
        content: `${cfg.name} - ${cfg.description}`
    })


    socket.on('questionRequest', async (msg) => {
        console.log('qusteionRequest')
        ctx.push({
            role: 'system',
            content: `Ask user this question: ${JSON.stringify(questions[0].text)}`,
        })
        questions.shift()

        const followUpUuid = randomUUID()
        const followUpStream: ChatCompletionStream<unknown> = await  openai.beta.chat.completions.stream({
            model: __GPT_MODEL__,
            messages: ctx,
            stream: true,
        });

        socket.emit('agent_stream_open', {message: '', agentId, messageId: followUpUuid});

        let streamContent = ''
        for await (const chunk of followUpStream) {
            const message = chunk.choices[0]?.delta?.content || ''
            streamContent += message
            socket.emit('agent_stream_merge', {message, agentId, messageId: followUpUuid});
        }
        ctx.push({role: 'system', content: streamContent})

        socket.emit('agent_stream_close', {message: '', agentId, messageId: followUpUuid});
    })

    return {
        prompt: async(prompt: string) => {

            // multiple stream events are linked by agentId and messageId (initialization and merge ale follow-up events)
            const messageId = randomUUID()


            ctx.push({role: 'user', content: prompt})

            // first openai stream with functionCalling which will check if user asks for another question and if so, it will invoke getNextQuestion tool
            const stream: ChatCompletionStream<unknown> = await  openai.beta.chat.completions.stream({
                model: __GPT_MODEL__,
                messages: ctx,
                stream: true,
                tools: [{
                    type: 'function',
                    function: {
                        name: 'getNextQuestion',
                        description: `if the user asks to get another question, invoke`,
                    },
                }]
            });

            let streamContent = ''
            let idx = 0
            for await (const chunk of stream) {
                const message = chunk.choices[0]?.delta?.content || ''
                streamContent += message
                // open merge event to merge stream chunks into initial event by agentId and messageId

                if(!chunk.choices[0].delta.tool_calls){

                    //  initial stream event without message (placeholder for stream chunks)
                    if(idx === 0) {
                        console.log("VYTVARIM")
                        socket.emit('agent_stream_open', {message: '', agentId, messageId});
                    }

                    socket.emit('agent_stream_merge', {message, agentId, messageId});
                }

                idx++
            }

            // finalizing stream event to get functionCalling result
            const chatCompletion = await stream.finalChatCompletion();

            // if toolCalls is invoked, execute the tool function
            const invokeToolCalling = chatCompletion.choices[0].finish_reason === 'tool_calls'

            if(!invokeToolCalling) {
                ctx.push({role: 'system', content: streamContent})
            }


            if(invokeToolCalling) {
                const toolFn =  chatCompletion.choices[0].message.tool_calls[0]

                if(toolFn.function.name === 'getNextQuestion'){
                    ctx.push({
                        role: 'system',
                        content: `Ask user this question: ${JSON.stringify(questions[0].text)}`,
                    })
                    questions.shift()

                    // follow up stream (after functionCalling) to get the next question to the user
                    const followUpUuid = randomUUID()
                    const followUpStream: ChatCompletionStream<unknown> = await  openai.beta.chat.completions.stream({
                        model: __GPT_MODEL__,
                        messages: ctx,
                        stream: true,
                    });

                    socket.emit('agent_stream_open', {message: '', agentId, messageId: followUpUuid});

                    let streamContent = ''
                    for await (const chunk of followUpStream) {
                        const message = chunk.choices[0]?.delta?.content || ''
                        streamContent += message
                        socket.emit('agent_stream_merge', {message, agentId, messageId: followUpUuid});
                    }
                    ctx.push({role: 'system', content: streamContent})

                    socket.emit('agent_stream_close', {message: '', agentId, messageId: followUpUuid});
                }
            }

        }
    }
}