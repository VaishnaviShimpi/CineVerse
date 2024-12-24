import { io } from 'socket.io-client';
import ACTIONS from './Actions.js';

const socket = io('http://localhost:5001');

export const initSocket = async () => {
    return socket;
};

export const sendMessage = (socketRef, { roomId, messageData }) => {
    socketRef.emit(ACTIONS.SEND_MESSAGE, { roomId, message: messageData });
};

export const receiveMessage = (socketRef, callback) => {
    socketRef.on(ACTIONS.RECEIVE_MESSAGE, (messageData) => {
        callback(messageData);
    });
};

