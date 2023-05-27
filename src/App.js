import { useEffect } from "react";
import logo from "./spotifyLogo.svg";
import "./App.css";
import { useSpotify } from "./hooks/useSpotify";
import { useNavigate } from "react-router-dom";

export default function App() {
  const { hasLoggedIn, login, spotifyApi, logout, user } = useSpotify();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasLoggedIn) {
      navigate("/home");
    }
  }, [hasLoggedIn]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Spotify Releases
      </header>
      <button autoFocus onClick={login}>
        Login
      </button>
      <div>hasLoggedIn: {"" + hasLoggedIn}</div>
    </div>
  );
}
