import React, { useEffect, useState, useRef } from 'react';
import Client from './Client';
import { initSocket, sendMessage, receiveMessage } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Editor.css';
import axios from 'axios';

import { useSelector } from 'react-redux';

const Editor = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId, movieName } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [movieIds, setMovieId] = useState([]);
    const [movieKey, setMovieKey] = useState('');

    const urlencodedMovie = encodeURIComponent(movieName);


    useEffect(() => {
        const getId = async () => {
            try {
                const { data } = await axios.get(`/api/v1/watch/movie/${movieName}`);
                setMovieId(data.content);
            } catch (error) {
                console.error('Error fetching Movie IDs:', error);
            }
        };
        if (movieName) getId();
    }, [movieName]);

    useEffect(() => {
        const getKey = async () => {
            try {
                for (const id of movieIds) {
                    try {
                        const { data } = await axios.get(`/api/v1/watch/key/${id}`);
                        const movieKey = data.content?.key;

                        if (movieKey) {
                            setMovieKey(movieKey);
                            break; // Exit the loop if a valid key is found
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 404) {
                            console.warn(`Movie Key not found for ID ${id}`);
                        } else {
                            console.error(`Error fetching Movie Key for ID ${id}:`, error);
                        }
                        // Continue the loop regardless of the error
                    }
                }
            } catch (error) {
                console.error("Unexpected error in getKey:", error);
            }
        };

        if (movieIds.length > 0) {
            getKey();
        }
    }, [movieIds]);




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
                    <button className="btn copyBtn" onClick={copyRoomId}>
                        Copy ROOM ID
                    </button>
                    <button className="btn leaveBtn" onClick={leaveRoom}>
                        Leave
                    </button>
                    <button className="btn recommendbtn" onClick={recommendMovie}>
                        Recommend Movie
                    </button>
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
                            <button className="sendButton" onClick={() => handleSendMessage()}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>

                {/* Video Container */}
                <div className="VIDEO">
                    {movieKey ? (
                        <iframe
                            className="videoIframe"
                            src={`https://www.youtube.com/embed/${movieKey}`}
                            title="YouTube video player"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <p>Loading video...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Editor;


