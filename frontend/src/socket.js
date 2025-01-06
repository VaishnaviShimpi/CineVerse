import { io } from 'socket.io-client';
import ACTIONS from './Actions.js';

const socket = io('http://localhost:5001'); // Server URL

export const initSocket = async () => {
    return socket;
};

// Chat: Send message
export const sendMessage = (socketRef, { roomId, messageData }) => {
    socketRef.emit(ACTIONS.SEND_MESSAGE, { roomId, message: messageData });
};

// Chat: Receive message
export const receiveMessage = (socketRef, callback) => {
    socketRef.on(ACTIONS.RECEIVE_MESSAGE, (messageData) => {
        callback(messageData);
    });
};

// Video sync: Send video sync updates
export const sendSync = (socketRef, syncData) => {
    socketRef.emit(ACTIONS.SYNC, syncData);
};

// Video sync: Receive video sync updates
export const receiveSync = (socketRef, callback) => {
    socketRef.on(ACTIONS.SYNC, (syncData) => {
        callback(syncData);
    });
};

// Disconnect socket
export const disconnectSocket = () => {
    if (socket) socket.disconnect();
};
