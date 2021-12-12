import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import Header from "../components/Header";
import { Link } from "react-router-dom";

import "./HomePage.css";

const HomePage = () => {
  let { user, uploadFile, authTokens, isFileUploading, logoutUser } =
    useContext(AuthContext);
  let [files, setFiles] = useState([]);
  const [audioURL, setAudioURL] = useState("");
  const [videoURL, setVideoURL] = useState("");

  const [showRooms, setShowRooms] = useState(true);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showURL, setShowURL] = useState(false);

  let [symblToken, setToken] = useState([]);
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    let getFiles = async () => {
      let response = await fetch("https://connect-django-backend.herokuapp.com/api/get-file/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Provide the authToken when making API request to backend to access the protected route of that user
          Authorization: "Bearer " + String(authTokens.access),
        },
      });
      let data = await response.json();
      console.log("DATA: ", data);

      if (response.status === 200) {
        setFiles(data);
      } else {
        alert("ERROR: ", data);
      }
    };

    let getSymblToken = async () => {
      let response = await fetch("https://connect-django-backend.herokuapp.com/api/symbl/token/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Provide the authToken when making API request to backend to access the protected route of that user
          Authorization: "Bearer " + String(authTokens.access),
        },
      });

      console.log("Response: ", response);
      let data = await response.json();
      //   console.log("DATA: ", data);
      const accessToken = JSON.parse(data.join(""));
      setAccessToken(accessToken);
      //   console.log("DATA0: ", data[0]);

      if (response.status === 200) {
        setToken(data);
        console.log("Symbl token:", symblToken);
      } else {
        alert("ERROR: ", data);
      }
    };

    getSymblToken();
    getFiles();
  }, [showURL]);

  const handleVideoURL = (e) => {
    e.preventDefault();
  };

  const handleAudioURL = (e) => {
    e.preventDefault();
    console.log(accessToken.accessToken);
    const authToken = accessToken.accessToken;

    const payload = {
      url: audioURL,
      name: "Godly Stuff",
      confidenceThreshold: 0.6,
    };

    const responses = {
      400: "Bad Request! Please refer docs for correct input fields.",
      401: "Unauthorized. Please generate a new access token.",
      404: "The conversation and/or it's metadata you asked could not be found, please check the input provided",
      429: "Maximum number of concurrent jobs reached. Please wait for some requests to complete.",
      500: "Something went wrong! Please contact support@symbl.ai",
    };

    const fetchData = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    fetch("https://api.symbl.ai/v1/process/audio/url", fetchData)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(responses[response.status]);
        }
      })
      .then((response) => {
        console.log("response", response);
        // from here
        const conversationId = response.conversationId;
        const authToken = accessToken.accessToken;
        const url = `https://api.symbl.ai/v1/conversations/${conversationId}/topics`;

        // Set headers
        let headers = new Headers();
        headers.append("Authorization", `Bearer ${authToken}`);

        const data = {
          method: "GET",
          headers: headers,
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/Request
        const request = new Request(url, data);

        fetch(request)
          .then((response) => {
            console.log("response", response);
            if (response.status === 200) {
              return response.json();
            } else {
              throw new Error("Something went wrong on api server!");
            }
          })
          .then((response) => {
            console.log("Success");
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <Header />
      <div className="sidebar">
        {user && (
          <div className="user-btn">
            <p>{user.username}</p>
            <Link to="">
              <div className="btn-link logout" onClick={logoutUser}>
                Logout
              </div>
            </Link>
          </div>
        )}
        <div class="btn-sidebar-container">
          <button
            className="btn-sidebar"
            onClick={() => {
              setShowRooms(true);
              setShowURL(false);
              setShowFileUpload(false);
            }}
          >
            Rooms
          </button>
          <button
            className="btn-sidebar"
            onClick={() => {
              setShowFileUpload(true);
              setShowURL(false);
              setShowRooms(false);
            }}
          >
            Upload files
          </button>
          <button
            className="btn-sidebar"
            onClick={() => {
              setShowURL(true);
              setShowRooms(false);
              setShowFileUpload(false);
            }}
          >
            Use Symbl
          </button>
        </div>
      </div>
      {/* <p>You are logged to the home page!</p>
            <p> Hello {user.username} </p> */}
      {showRooms && (
        <div className="rooms">
          <Link
            to={{ pathname: "https://connect-meeting.vercel.app/" }}
            target="_blank"
          >
            <button className="btn-room">Create a room</button>
          </Link>
          <Link
            to={{ pathname: "https://connect-meeting.vercel.app/" }}
            target="_blank"
          >
            <button className="btn-room">Join a room</button>
          </Link>
        </div>
      )}

      {showFileUpload && (
        <div className="upload-file">
          <form onSubmit={uploadFile}>
            {/* <h2>Upload a file here and let Symbl AI do it's things</h2> */}
            {isFileUploading && <h2>File is Uploading...</h2>}
            <input type="file" accept="audio/*" name="audio" />
            <input type="file" accept="video/*" name="video" />
            <input className="btn-submit" type="submit" />
          </form>
          {/* SYMBL ACCESS TOKEN: {symblToken['accessToken']}
            SYMBL TOKEN EXPIRES IN: {symblToken.expiresIn} */}
        </div>
      )}

      {showURL && (
        <div class="files">
          <h2>Enter the URL in the search bar and let Symbl AI do its thing</h2>

          <form onSubmit={handleAudioURL}>
            <input
              type="text"
              placeholder="Enter the URL of Audio file here..."
              value={audioURL}
              onChange={(e) => setAudioURL(e.target.value)}
            />
            <input type="submit" className="btn-submit" />
          </form>
          <form onSubmit={handleVideoURL}>
            <input
              type="text"
              placeholder="Enter the URL of Video file here..."
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
            />
            <input className="btn-submit" type="submit" />
          </form>

          <h3>Audio Files URL</h3>
          {files.map((file) => (
            <p key={file.id}>
              {file.audioFile && (
                <div
                  class="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(file.audioFile);
                  }}
                >
                  Copy
                </div>
              )}
              {file.audioFile}
            </p>
          ))}
          <h3>Video Files URL</h3>
          {files.map((file) => (
            <p key={file.id}>
              {file.videoFile && (
                <div
                  class="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(file.videoFile);
                  }}
                >
                  Copy
                </div>
              )}
              {file.videoFile}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
