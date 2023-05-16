import React, { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";

export default function RecentAlbumReleases({ recentAlbums }) {
  const getImageHref = (info) => {
    if (info.images && info.images.length) {
      return info.images[0].url;
    }
  };

  const columns = useMemo(() => [
    {
      header: "Image",
      accessorFn: getImageHref,
      cell: (props) => <img className={"albumImage"} src={props.getValue()} />,
    },
    {
      header: "Artist",
      accessorKey: "artistName",
    },
    {
      header: "Album Name",
      accessorKey: "name",
    },
    {
      header: "Date Released",
      accessorKey: "release_date",
    },
  ]);
  const tableOptions = {
    columns,
    data: recentAlbums,
    getCoreRowModel: getCoreRowModel(),
  };
  const tableInstance = useReactTable(tableOptions);

  recentAlbums &&
    recentAlbums.length &&
    console.log("recent albums render:", recentAlbums);
  return (
    <>
      <h1>Recent Album Releases ({recentAlbums.length} total)</h1>
      {recentAlbums && recentAlbums.length && (
        <table>
          <thead>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <tr {...headerGroup.props} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th {...header.props} key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {tableInstance.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
