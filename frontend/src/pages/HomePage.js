import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'
import { Link } from 'react-router-dom'

const HomePage = () => {
    
    let {user, createRoom} = useContext(AuthContext)

    return (
        <div>
            <Header/>
            <p>You are logged to the home page!</p>
            <p> Hello {user.username} </p>
            <Link to={{ pathname: "https://connect-meeting.vercel.app/" }} target="_blank" > <button>Create a room</button> </Link> <br/><br/>
            <Link to={{ pathname: "https://connect-meeting.vercel.app/" }} target="_blank" > <button>Join a room</button> </Link>
        </div>
    )
    


}

export default HomePage
