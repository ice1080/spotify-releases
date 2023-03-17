import { useEffect } from "react";
import logo from "./spotifyLogo.svg";
import "./App.css";
import { useSpotify } from "./hooks/useSpotify";

export default function App() {
  const { hasLoggedIn, login, spotifyApi, logout, user } = useSpotify();

  useEffect(() => {
    if (hasLoggedIn) {
      console.log("calling stuff here");
      spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(
        function (data) {
          console.log("Artist albums", data);
        },
        function (err) {
          console.error(err);
        }
      );
    }
  }, [hasLoggedIn]);

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
