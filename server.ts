
import { Server as SocketIOServer } from 'socket.io';
import express from 'express';
import next from 'next';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();
const exp = express();

import * as dotenv from 'dotenv';
import {linkAgentWsConnection} from "./server/ws-agents";
dotenv.config({ path: '.env.local' });

const PORT = process.env.PORT;
const WS_AGENT_URL = process.env.WS_AGENT_URL

app.prepare().then(async() => {
    const server = await new Promise<any>((resolve) => {
        const httpServer = exp.listen(PORT, () => {
            console.log(`[server]: Server is running at http://localhost:${PORT}`);
            resolve(httpServer);
        });
    });

    const io = new SocketIOServer(server, {
        cors: {
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    exp.get('/api', (req, res) => {
        res.json({ message: 'Hello from the server!' });
    })

    io.on('connect', (socket) => {
        console.log('connected');
        console.log('SOCKET ID: ', socket.id);
    });


    io.of('/agent/ws').on('connection', (socket) => {
        console.log('pim')
        const params = socket.handshake.query;

        console.log(`new ws connection to ${WS_AGENT_URL}, socketId: ${socket.id}, params: ${JSON.stringify(params)}`);

        const handshakeToken = params.handshakeToken as string;

        if (!handshakeToken) {
            console.log('no token provided');
            socket.disconnect();
            return;
        }

        linkAgentWsConnection(socket, handshakeToken).catch((err) => {
            console.error('error accepting ws connection', err);
            socket.disconnect();
        });
    });

    exp.all('*', (req, res) => {
        return handle(req, res);
    });
});