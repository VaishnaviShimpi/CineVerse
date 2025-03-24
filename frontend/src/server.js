import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import ACTIONS from './Actions.js';
import path from 'path';

const app = express();
const PORT = 5001;

app.use(cors({
    origin: 'http://localhost:5000', 
    methods: ['GET', 'POST'],
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).send(); 
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5000',
        methods: ['GET', 'POST'],
    },
});

const userSocketMap = {};
let lastVideoState = {
    action: 'pause',
    time: 0,
};

function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
    socket.emit('sync', lastVideoState);
   
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


    socket.on(ACTIONS.SYNC, (data) => {
        console.log('Received sync data:', data);
        lastVideoState = data;
        socket.broadcast.emit(ACTIONS.SYNC, data); 
    });

  
    socket.emit(ACTIONS.SYNC, lastVideoState);

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

    socket.on('disconnect', () => {
        console.log('Socket disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


