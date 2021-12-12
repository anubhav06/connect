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

  useEffect(() => {
    let getFiles = async () => {
      let response = await fetch("http://127.0.0.1:8000/api/get-file/", {
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

    getFiles();
  }, [showURL]);

  const handleVideoURL = (e) => {
    e.preventDefault();
  };

  const handleAudioURL = (e) => {
    e.preventDefault();
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
            Create Rooms
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
            Use Symbal
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
