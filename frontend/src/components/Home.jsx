import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        toast.success('Created a new room');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID and User Name is required');
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div style={{ backgroundColor: 'black', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <style>
                {`
                    .formWrapper {
                        background-color:rgba(0, 0, 0, 0);
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                    }
                    .inputBox {
                        width: 100%;
                        padding: 8px;
                        margin: 8px 0;
                        border-radius: 4px;
                        border: 1px solid #666;
                        background-color: white;
                        color: black;
                    }
                    
                    .joinBtn {
                     background-color: red;
                      color: white;
                    }
                `}
                
            </style>
            <div className='formWrapper'>
                <img src="/logo.png" alt="Icon" style={{alignContent: 'center', width: '200px', height: '200px' }} />
                <h4 className='mainLabel'><b>Paste invitation Room ID</b></h4>
                <div className='inputGroup'>
                    <input type="text" className='inputBox' placeholder='ROOM ID' onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter} />
                    <input type="text" className='inputBox' placeholder='User Name' onChange={(e) => setUsername(e.target.value)} value={username} onKeyUp={handleInputEnter} />
                    <button className='btn joinBtn'  onClick={joinRoom}>Join</button>
                    <div> 
                    <span className='createInfo'>
                        If you don't have an invite, create a&nbsp;
                        <a onClick={createNewRoom} style={{color:'#007bff'}} href="#" className='createNewBtn'><ul>new Room</ul></a>
                    </span>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Home;
