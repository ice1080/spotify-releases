import React, { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";

export default function Home() {
  const ARTISTS_VIEW = "artists";
  const ALBUMS_VIEW = "albums";
  const CUTOFF_DAYS_AGO = 250;
  let CUTOFF_DATE;

  const { spotifyApi } = useSpotify();
  const [topArtists, setTopArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [currentView, setCurrentView] = useState(ALBUMS_VIEW);

  useEffect(() => {
    spotifyApi.getMyTopArtists().then((data, err) => {
      const artists = data.items.sort((a, b) => {
        if (a.popularity > b.popularity) return -1;
        if (b.popularity < a.popularity) return 1;
        return 0;
      });
      console.log("top artists", artists);
      setTopArtists(artists);
    });
  }, []);

  useEffect(() => {
    if (topArtists.length > 0) {
      let tempRecentAlbums = [];
      topArtists.forEach((artist, i) => {
        spotifyApi
          .getArtistAlbums(artist.id, { include_groups: "album" })
          .then((data, err) => {
            if (err) {
              console.error(err);
            }
            if (data.items && data.items.length) {
              const recentArtistAlbums = data.items
                .filter(
                  (album) => Date.parse(album.release_date) > getCutoffDate()
                )
                .map((album) => {
                  album.artistName = artist.name;
                  return album;
                });
              console.log(`${artist.name} recent albums:`, recentArtistAlbums);
              if (recentArtistAlbums.length > 0) {
                tempRecentAlbums = tempRecentAlbums.concat(recentArtistAlbums);
                setRecentAlbums(tempRecentAlbums.concat(recentArtistAlbums));
              }
            }
          });
      });
    }
  }, [topArtists]);

  const getCutoffDate = () => {
    if (!CUTOFF_DATE) {
      let d = new Date();
      d.setDate(d.getDate() - CUTOFF_DAYS_AGO);
      CUTOFF_DATE = d;
    }
    return CUTOFF_DATE;
  };

  const renderCurrentView = () => {
    if (currentView === "artists") {
      return renderArtists();
    } else if (currentView === "albums") {
      return renderAlbums();
    }
  };

  const renderArtists = () => {
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
  };

  const renderAlbums = () => {
    // TODO remove duplicates by id, artist & album name
    return (
      <>
        <h1>Recent Album Releases ({recentAlbums.length} total)</h1>
        <ul>
          {recentAlbums
            .filter((element, idx, array) => {
              return (
                array.findIndex(
                  (arrayElement) => arrayElement.id === element.id
                ) === idx
              );
            })
            .map((album, i) => {
              return (
                <li key={i}>
                  {album.artistName} - {album.name} - {album.release_date}
                  <ul>
                    <li>spotify id: {album.id}</li>
                  </ul>
                </li>
              );
            })}
        </ul>
      </>
    );
  };

  const renderViewSelector = () => {
    return (
      <>
        <button onClick={() => setCurrentView(ARTISTS_VIEW)}>Artists</button>
        <button onClick={() => setCurrentView(ALBUMS_VIEW)}> Albums</button>
      </>
    );
  };

  return (
    <>
      {renderViewSelector()}
      {renderCurrentView()}
    </>
  );
}
