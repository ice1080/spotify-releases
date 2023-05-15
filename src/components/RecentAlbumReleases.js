import React, { useEffect, useState } from "react";

export default function RecentAlbumReleases({ recentAlbums }) {
  const isDuplicateAlbum = (album1, album2) => {
    return (
      album1.id === album2.id ||
      (album1.name === album2.name && album1.artistName === album2.artistName)
    );
  };

  const filteredAlbums = recentAlbums.filter((el, idx, array) => {
    return array.findIndex((arrayEl) => isDuplicateAlbum(arrayEl, el)) === idx;
  });

  // TODO remove duplicates by id, artist & album name
  return (
    <>
      <h1>Recent Album Releases ({recentAlbums.length} total)</h1>
      <ul>
        {filteredAlbums.map((album, i) => {
          return (
            <li key={i}>
              {album.artistName} - {album.name} - {album.release_date}
              {/* <ul>
                  <li>spotify id: {album.id}</li>
                  </ul>*/}
            </li>
          );
        })}
      </ul>
    </>
  );
}
