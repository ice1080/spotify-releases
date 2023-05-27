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
    spotifyApi
      .getMyTopArtists({ time_range: "long_term" })
      .then((data, err) => {
        const artists = data.items.sort((a, b) => {
          if (a.popularity > b.popularity) return -1;
          if (b.popularity < a.popularity) return 1;
          return 0;
        });
        /* console.log("top artists", artists); */
        setTopArtists(artists);
      });
  }, []);

  useEffect(() => {
    if (topArtists.length > 0) {
      let allRecentAlbums = [];
      let artistAlbumPromises = [];
      let localTopArtists = [...topArtists];
      topArtists.forEach((artist, i) => {
        // this may be needed once more artists are added (e.g. hundreds)
        /* if (!artist.recentAlbums) { */
        artistAlbumPromises.push(
          spotifyApi.getArtistAlbums(artist.id, {
            include_groups: "album",
          })
        );
        /* } */
      });
      Promise.all(artistAlbumPromises).then((values) => {
        values.forEach((data, i) => {
          if (data.items && data.items.length) {
            const recentArtistAlbums = data.items
              .filter(
                (album) => Date.parse(album.release_date) > getCutoffDate()
              )
              .map((album) => {
                album.artistName = localTopArtists[i].name;
                return album;
              });
            if (recentArtistAlbums.length > 0) {
              allRecentAlbums = allRecentAlbums.concat(recentArtistAlbums);
            }
          }
        });
        setRecentAlbums(allRecentAlbums);
      });
    }
  }, [topArtists]);

  useEffect(() => {
    if (recentAlbums.length > 0) {
      let tempRecentAlbums = [...recentAlbums];
      const albumIds = recentAlbums
        .filter((album) => album.isAlbumSaved === undefined)
        .map((alb) => alb.id);
      spotifyApi.containsMySavedAlbums(albumIds).then((savedBooleans, err) => {
        savedBooleans.forEach((isAlbumSaved, idx) => {
          tempRecentAlbums[idx].isAlbumSaved = isAlbumSaved;
        });
        console.log("done getting saved albums");
        setRecentAlbums(tempRecentAlbums);
      });
    }
  }, [recentAlbums]);

  const getCutoffDate = () => {
    if (!CUTOFF_DATE) {
      let d = new Date();
      d.setDate(d.getDate() - CUTOFF_DAYS_AGO);
      CUTOFF_DATE = d;
    }
    return CUTOFF_DATE;
  };

  const isDuplicateAlbum = (album1, album2) => {
    // todo figure out a better way to display duplicate albums
    return (
      album1.id === album2.id
      /* || */
      /* (album1.name === album2.name && album1.artistName === album2.artistName) */
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
        <button onClick={() => setCurrentView(ALBUMS_VIEW)}>
          Recent Albums
        </button>
        <button onClick={() => setCurrentView(ARTISTS_VIEW)}>
          Top Artists
        </button>
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
