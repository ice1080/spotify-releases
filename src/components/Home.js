import React, { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";
import RecentAlbumReleases from "./RecentAlbumReleases";
import TopArtists from "./TopArtists";

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
            if (data.items && data.items.length) {
              const recentArtistAlbums = data.items
                .filter(
                  (album) => Date.parse(album.release_date) > getCutoffDate()
                )
                .map((album) => {
                  album.artistName = artist.name;
                  return album;
                });
              if (recentArtistAlbums.length > 0) {
                console.log(
                  `${artist.name} recent albums:`,
                  recentArtistAlbums
                );
                tempRecentAlbums = tempRecentAlbums.concat(recentArtistAlbums);
                setRecentAlbums(tempRecentAlbums);
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

  const isDuplicateAlbum = (album1, album2) => {
    return (
      album1.id === album2.id ||
      (album1.name === album2.name && album1.artistName === album2.artistName)
    );
  };

  const filterAlbums = (albums) => {
    if (albums) {
      return albums
        .filter((el, idx, array) => {
          return (
            array.findIndex((arrayEl) => isDuplicateAlbum(arrayEl, el)) === idx
          );
        })
        .sort((a, b) => {
          return new Date(b.release_date) - new Date(a.release_date);
        });
    } else {
      return [];
    }
  };

  const renderCurrentView = () => {
    if (currentView === "artists") {
      return <TopArtists topArtists={topArtists} />;
    } else if (currentView === "albums") {
      return <RecentAlbumReleases recentAlbums={filterAlbums(recentAlbums)} />;
    }
  };

  const renderViewSelector = () => {
    return (
      <>
        <button onClick={() => setCurrentView(ARTISTS_VIEW)}>Artists</button>
        <button onClick={() => setCurrentView(ALBUMS_VIEW)}>Albums</button>
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
