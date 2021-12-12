import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";

import "./LoginPage.css";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div>
      <Header />
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="Enter Username" />
        <input type="password" name="password" placeholder="Enter Password" />
        <input className="btn-submit" type="submit" />
      </form>
    </div>
  );
};

export default LoginPage;
