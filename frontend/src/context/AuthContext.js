import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // Get the value of authToken from local storage. If the local storage contains authTokens, then parse the token(get the value back) , else set that to null
  // Callback function sets the value only once on inital load
  const [isFileUploading, setIsFileUploading] = useState(false);
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  // If the local storage contains authTokens, then decode the token, else set that to null
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  let [loading, setLoading] = useState(true);

  const history = useHistory();

  // Login User method
  let loginUser = async (e) => {
    e.preventDefault();
    // Make a post request to the api with the user's credentials.
    let response = await fetch("https://connect-django-backend.herokuapp.com/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 'e.target' is the form, '.username' gets the username field and '.password' gets the password field from wherever it is called (LoginPage.js here)
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });
    // Get the access and refresh tokens
    let data = await response.json();

    if (response.status === 200) {
      // Update the state with the logged in tokens
      setAuthTokens(data);
      // Decode the access token and store the information
      setUser(jwt_decode(data.access));
      // Set the authTokens in the local storage
      localStorage.setItem("authTokens", JSON.stringify(data));
      // Redirect user to home page
      history.push("/");
    } else {
      alert("Something went wrong!");
    }
  };

  // Logout User method
  let logoutUser = () => {
    // To logout, set 'setAuthTokens' and 'setUser' to null and remove the 'authTokens' from local storage
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    //history.push('/login')
  };

  // To register a user
  let registerUser = async (e) => {
    e.preventDefault();

    // Make a post request to the api with the user's credentials.
    let response = await fetch("https://connect-django-backend.herokuapp.com/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 'e.target' is the form, '.username' gets the username field and '.password' gets the password field from wherever it is called (LoginPage.js here)
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
        confirmPassword: e.target.confirmPassword.value,
        email: e.target.email.value,
      }),
    });
    // Get the access and refresh tokens
    let data = await response.json();

    if (response.status === 200) {
      console.log("Registered Successfully");
      alert(data);
      history.push("/");
    } else {
      console.log(data);
      alert(data);
    }
  };

  // To add a new food item
  let uploadFile = async (e) => {
    e.preventDefault();

    // Reference: https://medium.com/@emeruchecole9/uploading-images-to-rest-api-backend-in-react-js-b931376b5833
    let form_data = new FormData();
    form_data.append("audio", e.target.audio.files[0]);
    form_data.append("video", e.target.video.files[0]);

    let url = "https://connect-django-backend.herokuapp.com/api/upload-file/";
    setIsFileUploading(true);
    axios
      .post(url, form_data, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: "Bearer " + String(authTokens.access),
        },
      })
      .then((res) => {
        alert("SUCCESS: ", res.data);
        setIsFileUploading(false);
        history.push("/");
      })
      .catch((err) => alert("ERROR: ", err));
  };

  // Context data for AuthContext so that it can be used in other pages
  let contextData = {
    user: user,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    registerUser: registerUser,
    uploadFile: uploadFile,
    isFileUploading,
  };

  // To update the access tokens after every few time interval
  useEffect(() => {
    // --------------------------- updateToken method  ----------------------------------------
    // To update the access token
    let updateToken = async () => {
      // If no authToken exists i.e. user is not logged in then return
      if (!authTokens) {
        setLoading(false);
        return;
      }
      // Make a post request to the api with the refresh token to update the access token
      let response = await fetch("https://connect-django-backend.herokuapp.com/api/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the refresh token
        body: JSON.stringify({ refresh: authTokens?.refresh }),
      });
      let data = await response.json();

      if (response.status === 200) {
        // Update the data as done similarly in the login user method
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    };
    // --------------------------- updateToken method end  ----------------------------------------

    if (loading) {
      updateToken();
    }

    let fourMinutes = 1000 * 60 * 4;

    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    // Clear the interval after firing preventing re-initializing every time, refer to docs for more details
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {/* Render children components only after AuthContext loading is complete */}
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
