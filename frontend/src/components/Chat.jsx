import React, { useState, useEffect } from 'react';
import { sendMessage, receiveMessage } from '../socket';

const Chat = ({ socketRef, roomId, username }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        receiveMessage((data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(roomId, username, message);
            setMessages((prevMessages) => [...prevMessages, { username, message }]);
            setMessage('');
        }
    };

    return (
        <div className="chatContainer">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.username}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <div className="messageInput">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
