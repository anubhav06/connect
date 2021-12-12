import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

import Header from '../components/Header'
import { Link } from 'react-router-dom'

const HomePage = () => {
    
    let {user, uploadFile, authTokens} = useContext(AuthContext)
    let [files, setFiles] = useState([])
    let [symblToken, setToken] = useState([])
    

     useEffect(()=> {
        
        let getFiles = async() =>{
            let response = await fetch('http://127.0.0.1:8000/api/get-file/', {
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
                setFiles(data)
            }else{
                alert('ERROR: ', data)
            }
            
        }

        let getSymblToken = async() =>{
            let response = await fetch('http://127.0.0.1:8000/api/symbl/token/', {
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                    // Provide the authToken when making API request to backend to access the protected route of that user
                    'Authorization':'Bearer ' + String(authTokens.access)
                }
            })

            console.log('Response: ', response)
            let data = await response.json()
            console.log('DATA: ',data)
            console.log('DATA0: ',data['accessToken'])

            if(response.status === 200){
                setToken(data)
                console.log('Symbl token:', symblToken)
            }else{
                alert('ERROR: ', data)
            }
            
        }

        getSymblToken()
        getFiles()

    }, [])

    
    return (
        <div>
            <Header/>
            <p>You are logged to the home page!</p>
            <p> Hello {user.username} </p>
            <Link to={{ pathname: "https://connect-meeting.vercel.app/" }} target="_blank" > <button>Create a room</button> </Link> <br/><br/>
            <Link to={{ pathname: "https://connect-meeting.vercel.app/" }} target="_blank" > <button>Join a room</button> </Link>
        
            <div>
                <form onSubmit={uploadFile}>
                    <input type="file" accept="audio/*" name="audio"/> <br/><br/>
                    <input type="file" accept="video/*" name="video"/> <br/><br/>
                    <input type="submit"/>
                </form>
            </div>
            <br/><br/><br/><br/>


            <ul>
                {files.map(file => (   
                        <li key={file.id} >
                            Audio File: {file.audioFile} <br/><br/><br/>
                            Video File: {file.videoFile} <br/><br/><br/>
                        </li>  
                ))}
            </ul>

            SYMBL ACCESS TOKEN: {symblToken['accessToken']}
            SYMBL TOKEN EXPIRES IN: {symblToken.expiresIn}

        </div>
    )
    


}

export default HomePage
