import React, { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";

export default function Home() {
  const ARTISTS_VIEW = "artists";
  const ALBUMS_VIEW = "albums";
  const CUTOFF_DAYS_AGO = 500;
  let CUTOFF_DATE;

  const { spotifyApi } = useSpotify();
  const [topArtists, setTopArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [currentView, setCurrentView] = useState(ARTISTS_VIEW);

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

  useEffect(() => {
    if (topArtists.length > 0) {
      let localRecentAlbums = [];
      topArtists.forEach((artist, i) => {
        spotifyApi
          .getArtistAlbums(artist.id, { include_groups: "album" })
          .then((data, err) => {
            if (err) {
              console.error(err);
            }
            if (data.items && data.items.length) {
              /* console.log(
               *   `${artist.name} albums:`,
               *   data.items.map(
               *     (album) => `${album.name}: ${Date.parse(album.release_date)}`
               *   )
               * ); */
              const recentArtistAlbums = data.items
                .filter(
                  (album) => Date.parse(album.release_date) > getCutoffDate()
                )
                .map((album) => {
                  album.artistName = artist.name;
                  return album;
                });
              console.log(
                /* getCutoffDate(), */
                `${artist.name} recent albums:`,
                recentArtistAlbums
              );
              /* data.items.map((album) => album.release_date),
               * data.items.map((album) => Date.parse(album.release_date)) */
              /* ); */
              if (recentArtistAlbums.length > 0) {
                localRecentAlbums =
                  localRecentAlbums.concat(recentArtistAlbums);
                console.log("total recent albums: ", localRecentAlbums.length);
                console.log("concat: ", localRecentAlbums);
                setRecentAlbums(localRecentAlbums.concat(recentArtistAlbums));
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
    return (
      <>
        <h1>Recent Album Releases ({recentAlbums.length} total)</h1>
        <ul>
          {recentAlbums.map((album, i) => {
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
