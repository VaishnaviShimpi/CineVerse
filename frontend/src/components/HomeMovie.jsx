import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HomeMovie = () => {
    const navigate = useNavigate();
    const [MovieName, setMovieName] = useState('');

    const EnterRoom = () => {
        if (!MovieName) {
            toast.error('Movie Name is required');
            return;
        }
        //Fetch movie src here.

        navigate(`/Home`, {});
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
                <h4 className='mainLabel'><b>Enter Valid Movie or Tv Show</b></h4>
                <div className='inputGroup'>
                    <input type="text" className='inputBox' placeholder='Enter the Name Here' onChange={(e) => setMovieName(e.target.value)}  value={MovieName}/>
                    
                    <button className='btn EnterBtn'  onClick={EnterRoom}>Enter</button>
                </div>
            </div>
            
        </div>
    );
};

export default HomeMovie;
