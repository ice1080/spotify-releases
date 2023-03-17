import React, { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";

export default function Home() {
  const { spotifyApi } = useSpotify();
  const [topArtists, setTopArtists] = useState([]);
  useEffect(() => {
    spotifyApi.getMyTopArtists().then((data, err) => {
      const artists = data.items.sort((a, b) => {
        if (a.popularity > b.popularity) return -1;
        if (b.popularity < a.popularity) return 1;
        return 0;
      });
      console.log("artists", artists);
      setTopArtists(artists);
    });
  }, []);

  return (
    <>
      <h1>Your Top Artists</h1>
      <ul>
        {topArtists.map((artist, i) => {
          return <li key={i}>{artist.name}</li>;
        })}
      </ul>
    </>
  );
}
