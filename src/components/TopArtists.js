import React from "react";

export default function TopArtists({ topArtists }) {
  return (
    <>
      <h1>Your Top Artists ({topArtists.length})</h1>
      <ul>
        {topArtists.map((artist, i) => {
          return <li key={i}>{artist.name}</li>;
        })}
      </ul>
    </>
  );
}
