import React from "react";

export default function RecentAlbumReleases({ recentAlbums }) {
  const isDuplicateAlbum = (album1, album2) => {
    return (
      album1.id === album2.id ||
      (album1.name === album2.name && album1.artistName === album2.artistName)
    );
  };

  const albumsToRender = recentAlbums
    .filter((el, idx, array) => {
      return (
        array.findIndex((arrayEl) => isDuplicateAlbum(arrayEl, el)) === idx
      );
    })
    .sort((a, b) => {
      return new Date(b.release_date) - new Date(a.release_date);
    });

  return (
    <>
      <h1>Recent Album Releases ({albumsToRender.length} total)</h1>
      <ul>
        {albumsToRender.map((album, i) => {
          return (
            <li key={i}>
              {album.artistName} - {album.name} - {album.release_date}
            </li>
          );
        })}
      </ul>
    </>
  );
}
