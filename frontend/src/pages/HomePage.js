import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

import Header from '../components/Header'
import { Link } from 'react-router-dom'

const HomePage = () => {
    
    let {user, uploadAudio} = useContext(AuthContext)
    let [audioFiles, setAudioFiles] = useState([])
    let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)

     // call getNotes on load
     useEffect(()=> {
        
        // To fetch the notes of a user
        let getAudioFiles = async() =>{
            let response = await fetch('http://127.0.0.1:8000/api/get-audio/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })
            let data = await response.json()
            console.log('DATA: ',data)

            if(response.status === 200){
                setAudioFiles(data)
            }else{
                alert('ERROR: ', data)
            }
            
        }

        getAudioFiles()

    }, [])

    
    return (
        <div>
            <Header/>
            <p>You are logged to the home page!</p>
            <p> Hello {user.username} </p>
            <Link to={{ pathname: "https://connect-meeting.vercel.app/" }} target="_blank" > <button>Create a room</button> </Link> <br/><br/>
            <Link to={{ pathname: "https://connect-meeting.vercel.app/" }} target="_blank" > <button>Join a room</button> </Link>
        
            <div>
                <form onSubmit={uploadAudio}>
                    <input type="file" accept="audio/*" name="audio"/> <br/>
                    <input type="submit"/>
                </form>
            </div>
            <br/><br/>

            <ul>
                {audioFiles.map(audio => (   
                        <li key={audio.id} >
                            {audio.audioFile} <br/><br/><br/>
                        </li>  
                ))}
            </ul>

        </div>
    )
    


}

export default HomePage
