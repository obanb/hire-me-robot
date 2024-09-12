import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

type WebSocketData = {
    message: string,
    socketId?: string,
    agentId: string,
    messageId: string
}

type Message = WebSocketData & {status: 'opened' | 'merging' | 'closed'}

export const useWebSocket = (url: string, handshakeToken: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(url, {
            query: { handshakeToken },
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });

        socket.on('response', (data: WebSocketData) => {
            // Handle incoming data
            setMessages((prevMessages) => [
                ...prevMessages,
                {...data, status: 'closed'}
            ]);
        });

        socket.on('agent_stream_open', (chunk: WebSocketData) => {
            setMessages((prevMessages) => [...prevMessages,{ ...chunk, message: "", status: 'merging' }]);
        });
        socket.on('agent_stream_merge', (chunk: WebSocketData) => {
            setMessages((prevMessages) => {
                return prevMessages.map((msg) => {
                    if (msg.status === 'merging' && msg.agentId === chunk.agentId && msg.messageId === chunk.messageId) {
                        return {
                            ...msg,
                            status: 'merging',
                            message: msg.message + chunk.message,
                        };
                    }
                    return msg;
                });
            });
        });
        socket.on('agent_stream_close', (chunk: WebSocketData) => {
            setMessages((prevMessages) => {
                return prevMessages.map((msg) => {
                    if (msg.agentId === chunk.agentId && msg.messageId === chunk.messageId) {
                        return {
                            ...msg,
                            status: 'closed',
                        };
                    }
                    return msg;
                });
            });
       });

        socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket server');
        });

        socket.on('error', (err) => {
            console.error('WebSocket error:', err);
        });

        // Cleanup the socket connection on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current!.disconnect();
            }
        };
    }, [url, handshakeToken]);

    // Function to send a message
    const sendMessage = (message: string) => {
        if (socketRef.current) {
            socketRef.current!.emit('message', message);
        }
    };

    const questionRequest = () => {
        console.log("QUESTION REQUEST");
        if (socketRef.current) {
            socketRef.current!.emit('questionRequest', "");
        }
    };

    return { messages, sendMessage, questionRequest };
};