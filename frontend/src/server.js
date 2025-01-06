import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import ACTIONS from './Actions.js';
import path from 'path';

const app = express();
const PORT = 5001;

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5000', // Replace with frontend URL if different
    methods: ['GET', 'POST'],
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Optional HTML serving
});

app.get('/favicon.ico', (req, res) => {
    res.status(204).send(); // No Content
});

// Create HTTP and WebSocket servers
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5000', // Replace with frontend URL if different
        methods: ['GET', 'POST'],
    },
});

// Data structures for chat and video sync
const userSocketMap = {};
let lastVideoState = {
    action: 'pause',
    time: 0,
};

// Helper function to get all connected clients in a room
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        };
    });
}

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);

    // Chat: Joining a room
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

    // Chat: Sending a message
    socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
        io.in(roomId).emit(ACTIONS.RECEIVE_MESSAGE, message);
    });

    // Chat: Sending emojis
    socket.on(ACTIONS.SEND_EMOJI, ({ roomId, emoji }) => {
        io.in(roomId).emit(ACTIONS.RECEIVE_EMOJI, emoji);
    });

    // Video sync: Broadcast video actions (play, pause, seek)
    socket.on(ACTIONS.SYNC, (data) => {
        console.log('Received sync data:', data);
        lastVideoState = data;
        socket.broadcast.emit(ACTIONS.SYNC, data); // Notify other clients
    });

    // Send the last video state to newly connected clients
    socket.emit(ACTIONS.SYNC, lastVideoState);

    // Handle disconnection
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

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// import express from 'express';
// import cors from 'cors';
// import http from 'http';
// import { Server } from 'socket.io';
// import ACTIONS from './Actions.js';

// const app = express();
// const server = http.createServer(app);



// app.use(cors({
//     origin: 'http://localhost:5000',
//     methods: ['GET', 'POST']
// }));

// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5000",
//         methods: ["GET", "POST"]
//     }
// });

// const userSocketMap = {};

// function getAllConnectedClients(roomId) {
//     return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
//         return {
//             socketId,
//             username: userSocketMap[socketId],
//         };
//     });
// }

// io.on('connection', (socket) => {
//     console.log('socket connected', socket.id);

//     socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
//         userSocketMap[socket.id] = username;
//         socket.join(roomId);
//         const clients = getAllConnectedClients(roomId);
//         clients.forEach(({ socketId }) => {
//             io.to(socketId).emit(ACTIONS.JOINED, {
//                 clients,
//                 username,
//                 socketId: socket.id,
//             });
//         });
//     });

//     socket.on(ACTIONS.SEND_MESSAGE, ({ roomId, message }) => {
//         io.in(roomId).emit(ACTIONS.RECEIVE_MESSAGE, message);
//     });

//     socket.on(ACTIONS.SEND_EMOJI, ({ roomId, emoji }) => {
//         io.in(roomId).emit(ACTIONS.RECEIVE_EMOJI, emoji);
//     });

//     socket.on('disconnecting', () => {
//         const rooms = [...socket.rooms];
//         rooms.forEach((roomId) => {
//             socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
//                 socketId: socket.id,
//                 username: userSocketMap[socket.id],
//             });
//         });
//         delete userSocketMap[socket.id];
//         socket.leave();
//     });
// });

// const PORT = 5001;
// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

