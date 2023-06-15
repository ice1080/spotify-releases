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
  const SAVED_ALBUMS_LIMIT = 50;
  const ARTIST_MIN_SAVED_ALBUM_COUNT = 2;
  let CUTOFF_DATE;

  const { spotifyApi, hasLoggedIn } = useSpotify();
  const [topArtists, setTopArtists] = useState([]);
  const [savedAlbumArtists, setSavedAlbumArtists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [includeSavedAlbums, setIncludeSavedAlbums] = useState(true);
  const [currentView, setCurrentView] = useState(ALBUMS_VIEW);

  useEffect(() => {
    if (hasLoggedIn) {
      getAllTopArtists();
      getAllSavedAlbums();
    }
  }, [hasLoggedIn]);

  useEffect(() => {
    if (
      topArtists.length > 0 &&
      (savedAlbumArtists.length > 0 || !includeSavedAlbums)
    ) {
      getAllRecentAlbums();
    }
  }, [topArtists, savedAlbumArtists, includeSavedAlbums]);

  useEffect(() => {
    if (Object.keys(recentAlbums).length > 0) {
      addSavedAlbums();
    }
  }, [recentAlbums]);

  const getAllTopArtists = () => {
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
      let localTopArtists = [];
      artistsList.forEach((values) => {
        localTopArtists = localTopArtists.concat(values.items);
      });
      localTopArtists = localTopArtists.sort((a, b) => {
        if (a.popularity > b.popularity) return -1;
        if (b.popularity < a.popularity) return 1;
        return 0;
      });
      console.log("top artists", localTopArtists, localTopArtists.length);
      setTopArtists(localTopArtists);
    });
  };

  const getAllSavedAlbums = () => {
    if (includeSavedAlbums) {
      let albumPromises = [];
      for (let i = 0; i < 20; i++) {
        albumPromises.push(
          spotifyApi.getMySavedAlbums({
            limit: 50,
            offset: i * SAVED_ALBUMS_LIMIT,
          })
        );
      }
      Promise.all(albumPromises).then((albumsList) => {
        let localSavedAlbums = [];
        albumsList.forEach((values) => {
          localSavedAlbums = localSavedAlbums.concat(
            values.items.map((el) => el.album)
          );
        });
        let artistSavedAlbumCount = {};
        let minSavedCountArtists = new Set();
        localSavedAlbums.forEach((album) => {
          album.artists.forEach((artist) => {
            let newCount = 1;
            if (artistSavedAlbumCount[artist.name]) {
              newCount = artistSavedAlbumCount[artist.name].count + 1;
              artistSavedAlbumCount[artist.name].count = newCount;
            } else {
              artistSavedAlbumCount[artist.name] = {
                count: newCount,
                artist: artist,
              };
            }
            if (newCount === ARTIST_MIN_SAVED_ALBUM_COUNT) {
              minSavedCountArtists.add(artist);
            }
          });
        });
        /* const filteredTest = Object.keys(artistSavedAlbumCount)
         *   .filter(
         *     (artistName) =>
         *       artistSavedAlbumCount[artistName].count >=
         *       ARTIST_MIN_SAVED_ALBUM_COUNT
         *   )
         *   .reduce(
         *     (res, key) =>
         *       Object.assign(res, { [key]: artistSavedAlbumCount[key] }),
         *     {}
         *   ); */

        /* console.log("localSavedAlbums", localSavedAlbums); */
        /* console.log(
         *   "artistSavedAlbumCount",
         *   artistSavedAlbumCount,
         *   Object.keys(artistSavedAlbumCount).length
         * ); */
        /* console.log(
         *   `artists with more than ${ARTIST_MIN_SAVED_ALBUM_COUNT} saved albums`,
         *   filteredTest,
         *   Object.keys(filteredTest).length
         * ); */
        console.log(
          "savedAlbumArtists",
          minSavedCountArtists,
          minSavedCountArtists.size
        );
        setSavedAlbumArtists(Array.from(minSavedCountArtists));
      });
    }
  };

  const addSavedAlbums = async () => {
    let tempRecentAlbums = { ...recentAlbums };
    const albumIds = Object.keys(recentAlbums).filter(
      (albumId) => recentAlbums[albumId].isAlbumSaved === undefined
    );
    if (albumIds.length) {
      for (let i = 0; i < albumIds.length; i += SAVED_ALBUMS_LIMIT) {
        const tempIds = albumIds.slice(i, i + SAVED_ALBUMS_LIMIT);
        await spotifyApi
          .containsMySavedAlbums(tempIds)
          .then((savedBooleans, err) => {
            savedBooleans.forEach((isAlbumSaved, idx) => {
              tempRecentAlbums[tempIds[idx]].isAlbumSaved = isAlbumSaved;
            });
          });
      }
      setRecentAlbums(tempRecentAlbums);
    }
  };

  const getAllRecentAlbums = () => {
    let allRecentAlbums = {};
    let artistAlbumPromises = [];
    let allArtists = combineArtistLists();
    allArtists.forEach((artist) => {
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
            .filter((album) => Date.parse(album.release_date) > getCutoffDate())
            .map((album) => {
              album.artistName = allArtists[i].name;
              return album;
            });
          if (recentArtistAlbums.length > 0) {
            recentArtistAlbums.map((item) => (allRecentAlbums[item.id] = item));
          }
        }
      });
      /* console.log("recent albums", allRecentAlbums); */
      setRecentAlbums(allRecentAlbums);
    });
  };

  const combineArtistLists = () => {
    let combined = {};
    topArtists.forEach((artist) => {
      combined[artist.id] = artist;
    });
    if (includeSavedAlbums) {
      savedAlbumArtists.forEach((artist) => {
        if (!combined[artist.id]) {
          combined[artist.id] = artist;
        }
      });
    }
    return Object.values(combined);
  };

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
      return (
        <RecentAlbumReleases
          recentAlbums={filterAlbums(recentAlbums)}
          includeSavedAlbums={includeSavedAlbums}
          setIncludeSavedAlbums={setIncludeSavedAlbums}
        />
      );
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
