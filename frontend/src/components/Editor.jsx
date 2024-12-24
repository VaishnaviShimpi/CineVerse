import React, { useEffect, useState, useRef } from 'react';
import Client from './Client';
import { initSocket, sendMessage, receiveMessage } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Editor.css';
import { useSelector } from "react-redux";

const Editor = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');


    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();

            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e) {
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });

            socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) => prev.filter((client) => client.socketId !== socketId));
            });

            receiveMessage(socketRef.current, (messageData) => {
                setMessages((prevMessages) => [...prevMessages, messageData]);
            });
        };

        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current.off(ACTIONS.JOINED);
                socketRef.current.off(ACTIONS.DISCONNECTED);
            }
        };
    }, []);

    const handleSendMessage = (msg) => {
        const messageData = {
            username: location.state?.username,
            message: msg || message,
        };
        sendMessage(socketRef.current, { roomId, messageData });
        setMessage('');
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId);
        toast.success('Room ID copied to clipboard');
    };

    // New function to handle leaving the room
    const leaveRoom = () => {
        socketRef.current.emit(ACTIONS.LEAVE, { roomId, username: location.state?.username });
        reactNavigator('/');
    };

    const recommendMovie = () => {
        window.location.href = 'http://127.0.0.1:5050';
    };

    if (!location.state) {
        return <Navigate to="/" />;
    }

    return (
        <div className="mainWrap">
            <div className="aside">

                <div className="logo">
                    <img className="logoImage" src="/logo.png" style={{ height: '150px' }} />
                </div>

                <div className="clientList">
                    {clients.map((client) => (
                        <Client key={client.socketId} username={client.username} />
                    ))}
                </div>
                <div>
                    <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>Leave</button>
                    <button className="btn recommendbtn" onClick={recommendMovie}>recommend Movie</button>
                </div>

            </div>

            <div className="editorWrap">
                <div className="chatContainer">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.username}: </strong>
                                <span>{msg.message}</span>
                            </div>
                        ))}
                    </div>

                    <div className="inputContainer">
                        <div className="emojiContainer">
                            <button onClick={() => handleSendMessage('😀')}>😀</button>
                            <button onClick={() => handleSendMessage('❤')}>❤</button>
                            <button onClick={() => handleSendMessage('👍')}>👍</button>
                        </div>

                        <div className="messageInput">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message"
                            />
                            <button className='sendButton' onClick={() => handleSendMessage()}>Send</button>
                        </div>
                    </div>

                </div>


                {/* Video Container */}
                <div className="VIDEO">
                    <iframe
                        className="videoIframe"
                        src="https://www.youtube.com/embed/_K5B5tRBo5M"
                        title="YouTube video player"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Editor;

