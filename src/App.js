import { useEffect } from "react";
import logo from "./spotifyLogo.svg";
import "./App.css";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

function App() {
  useEffect(() => {
    spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE").then(
      (data) => {
        console.log("data", data);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        Spotify Releases
      </header>
    </div>
  );
}

export default App;
