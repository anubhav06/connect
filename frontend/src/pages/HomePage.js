import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import Header from '../components/Header'

const HomePage = () => {
    
    let {user, logoutUser} = useContext(AuthContext)

    return (
        <div>
            <Header/>
            <p>You are logged to the home page!</p>
            <p> Hello {user.username} </p>

        </div>
    )


}

export default HomePage
