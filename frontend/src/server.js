import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import ACTIONS from './Actions.js';

const app = express();
const server = http.createServer(app);



app.use(cors({
    origin: 'http://localhost:5000',
    methods: ['GET', 'POST']
}));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5000",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
        io.in(roomId).emit(ACTIONS.RECEIVE_MESSAGE, message);
    });

    socket.on(ACTIONS.SEND_EMOJI, ({ roomId, emoji }) => {
        io.in(roomId).emit(ACTIONS.RECEIVE_EMOJI, emoji);
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = 5001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

