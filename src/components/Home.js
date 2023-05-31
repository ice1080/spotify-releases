import React, { useEffect, useState } from "react";
import { useSpotify } from "../hooks/useSpotify";
import RecentAlbumReleases from "./RecentAlbumReleases";
import TopArtists from "./TopArtists";

export default function Home() {
  const ARTISTS_VIEW = "artists";
  const ALBUMS_VIEW = "albums";
  const CUTOFF_DAYS_AGO = 250;
  const MAX_ARTISTS_LIMIT = 101;
  const TOP_ARTISTS_LIMIT = 49;
  let CUTOFF_DATE;

  const { spotifyApi, hasLoggedIn } = useSpotify();
  const [topArtists, setTopArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [currentView, setCurrentView] = useState(ALBUMS_VIEW);

  useEffect(() => {
    if (hasLoggedIn) {
      let localTopArtists = [];
      let artistPromises = [];
      let artistLimitArray = [50, 50];
      artistLimitArray.forEach((limit, i) => {
        artistPromises.push(
          spotifyApi.getMyTopArtists({
            time_range: "long_term",
            limit: limit,
            offset: i * TOP_ARTISTS_LIMIT,
          })
        );
      });
      Promise.all(artistPromises).then((artistsList) => {
        artistsList.forEach((values) => {
          localTopArtists = localTopArtists.concat(values.items);
        });
        localTopArtists = localTopArtists.sort((a, b) => {
          if (a.popularity > b.popularity) return -1;
          if (b.popularity < a.popularity) return 1;
          return 0;
        });
        /* console.log("top artists", localTopArtists); */
        setTopArtists(localTopArtists);
      });
    }
  }, [hasLoggedIn]);

  useEffect(() => {
    if (topArtists.length > 0) {
      let allRecentAlbums = {};
      let artistAlbumPromises = [];
      let localTopArtists = [...topArtists];
      topArtists.forEach((artist) => {
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
              recentArtistAlbums.map(
                (item) => (allRecentAlbums[item.id] = item)
              );
            }
          }
        });
        /* console.log("recent albums", allRecentAlbums); */
        setRecentAlbums(allRecentAlbums);
      });
    }
  }, [topArtists]);

  useEffect(() => {
    if (Object.keys(recentAlbums).length > 0) {
      let tempRecentAlbums = { ...recentAlbums };
      const albumIds = Object.keys(recentAlbums).filter(
        (albumId) => recentAlbums[albumId].isAlbumSaved === undefined
      );
      if (albumIds.length) {
        spotifyApi
          .containsMySavedAlbums(albumIds)
          .then((savedBooleans, err) => {
            savedBooleans.forEach((isAlbumSaved, idx) => {
              tempRecentAlbums[albumIds[idx]].isAlbumSaved = isAlbumSaved;
            });
            setRecentAlbums(tempRecentAlbums);
          });
      }
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
      return (
        Object.values(albums)
          /* .filter((albumId, idx, array) => {
           *   return (
           *     array.findIndex((arrayEl) =>
           *       isDuplicateAlbum(albums[arrayEl], albums[albumId])
           *     ) === idx
           *   );
           * }) */
          .sort((a, b) => {
            return new Date(b.release_date) - new Date(a.release_date);
          })
      );
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
