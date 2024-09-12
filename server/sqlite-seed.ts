import {db} from "./sqlite-connector";
import {agent, invitation, question} from "./sqlite-schemas";

const seed = async () => {
    try {
        const invitationId = crypto.randomUUID()
        await db.insert(invitation as any).values([
            {
                id: invitationId,
                email: 'email@email.cz',
                vectorKey: 'vector-key',
                used: false as any
            }
        ])


        const simonaAgentId = crypto.randomUUID()
        await db.insert(agent as any).values([
            {
                agent: simonaAgentId,
                name: "Simona",
                description: "You are the director of Apitree and give general information about the running of the company, leaving the IT technical issues to others. At first, introduce yourself.",
                priority: 2,
                invitationId
            },
        ])


        const alesAgentId = crypto.randomUUID()
        await db.insert(agent as any).values([
            {
                agent: alesAgentId,
                name: "Aleš",
                description: "You're the CTO of a company and you ask or answer IT technical questions. At first, introduce yourself.",
                priority: 1,
                invitationId
            },
        ])


        await db.insert(question as any).values([
            {
                agent: alesAgentId,
                used: false as any,
                text:"Vysvětlete prosím funkci reduce v Javascriptu.",
                invitationId
            },
        ])
        await db.insert(question as any).values([
            {
                agent: alesAgentId,
                used: false as any,
                text:"Dokázal byste vysvětlit rozdíl mezi let a const v Javascriptu?",
                invitationId
            },
        ])
        await db.insert(question as any).values([
            {
                agent: alesAgentId,
                used: false as any,
                text:"Říká vám něco pojem event loop?",
                invitationId
            },
        ])
        await db.insert(question as any).values([
            {
                agent: alesAgentId,
                used: false as any,
                text:"Jaké znáte hooky v Reactu?",
                invitationId
            },
        ])
        await db.insert(question as any).values([
            {
                agent: simonaAgentId,
                used: false as any,
                text:"Nyní bych nechala prostor pro Vaše otázky. Zajímalo by vás něco konkrétního o společnosti ApiTree?",
                invitationId
            },
        ])

    }catch (error:any) {
        console.error('Failed to seed database:', error.stack)
    }
}


seed()