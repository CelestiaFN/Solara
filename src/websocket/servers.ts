import WebSocket, { WebSocketServer } from 'ws';
import { createServer, IncomingMessage } from 'http';
import logger from '../utils/logger/logger';
import Servers from '../database/models/servers';

const server = createServer();
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket, request: IncomingMessage) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');

    if (!sessionId) {
        ws.close();
        return;
    }

    ws.on('message', async (message: string) => {
        try {
            const msgstring = message.toString();
            const data = JSON.parse(msgstring);

            if (data.region && data.playlist) {
                await Servers.findOneAndUpdate(
                    { sessionId },
                    {
                        sessionId,
                        region: data.region,
                        playlist: data.playlist,
                        state: data.state || "AVAILABLE",
                        players: data.players || 0,
                        playercap: 100,
                        startedAt: data.startedAt || new Date().toISOString()
                    },
                    { upsert: true, new: true }
                );
            } else {
                console.log('Invalid format:', message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    ws.on('close', async () => {
        if (sessionId) {
            try {
                await Servers.findOneAndDelete({ sessionId });
                console.log(`Server removed from database for session: ${sessionId}`);
            } catch (error) {
                console.error('Error removing server from database:', error);
            }
        }
    });
});

server.on('upgrade', (request: IncomingMessage, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const sessionId = url.searchParams.get('sessionId');

    if (sessionId) {
        wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
            (wss as any).emit('connection', ws, request);
        });
    } else {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
    }
});

const PORT = 29801;
server.listen(PORT, () => {
    logger.startup(`Server WebSocket is listening on port ${PORT}`);
});
