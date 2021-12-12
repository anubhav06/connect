import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

import "./Header.css";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  return (
    <div className="header">
      {!user && <h1 className="logo">Connect</h1>}

      <div className="links">
        {/* <span> | </span> */}
        {/* If user is logged in then show logout button else show login button */}
        {user ? null : (
          <div className="btn-link">
            <Link to="/login">Login</Link>
          </div>
        )}

        {/* <span> | </span> */}
        {user ? null : (
          <div className="btn-link">
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>
      {/* {user && (
        <div className="user-btn">
          <p>{user.username}</p>
          <Link to="">
            <div className="btn-link logout" onClick={logoutUser}>
              Logout
            </div>
          </Link>
        </div>
      )} */}

      {/* <span> | </span> */}
      {/* If user exists then display the username */}
      {/* {user ? <Link to="/TODO"> {user.username} </Link> : null} */}
    </div>
  );
};

export default Header;
