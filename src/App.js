import { useEffect } from "react";
import logo from "./spotifyLogo.svg";
import "./App.css";
import SpotifyWebApi from "spotify-web-api-js";
import { useSpotify } from "./hooks/useSpotify";

const spotifyApi = new SpotifyWebApi();

export default function App() {
  const { hasLoggedIn, isLoading, login, logout, user } = useSpotify();

  console.log("has?", hasLoggedIn);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Spotify Releases
      </header>
      <button onClick={login}>Login</button>
      <div>hasLoggedIn: {"" + hasLoggedIn}</div>
    </div>
  );
}
