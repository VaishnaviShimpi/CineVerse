import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const HomeMovie = () => {
    const navigate = useNavigate();
    const [movieName, setMovieName] = useState('');

    const handleMovieSearch = () => {
        if (!movieName) {
            toast.error('Movie Name is required');
            return;
        }
        
        const urlencodedMovie = encodeURIComponent(movieName);
        console.log(`Inside HomeMovie (Moviename is ${movieName})  && (urlencoded is ${urlencodedMovie})`);
        navigate(`/Home/${urlencodedMovie}`);
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            handleMovieSearch();
        }
    };

    return (
        <div style={{ backgroundColor: 'black', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <style>
                {`
                    .formWrapper {
                        background-color: rgba(0, 0, 0, 0);
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
                    .searchBtn {
                        background-color: red;
                        color: white;
                    }
                    .createNewBtn {
                        color: #007bff;
                        text-decoration: none;
                    }
                `}
            </style>
            <div className='formWrapper'>
                <img src="/logo.png" alt="Icon" style={{ alignContent: 'center', width: '200px', height: '200px' }} />
                <h4 className='mainLabel'><b>Enter Movie Name</b></h4>
                <div className='inputGroup'>
                    <input
                        type="text"
                        className='inputBox'
                        placeholder='Movie Name'
                        onChange={(e) => setMovieName(e.target.value)}
                        value={movieName}
                        onKeyUp={handleInputEnter}
                    />
                    <button className='btn searchBtn' onClick={handleMovieSearch}>Search</button>
                </div>
            </div>
        </div>
    );
};

export default HomeMovie;
