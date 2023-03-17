import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { SpotifyProvider } from "./hooks/useSpotify";
import SpotifyRedirect from "./components/SpotifyRedirect";
import Home from "./components/Home";
import "./index.css";

const router = createBrowserRouter([
  {
    element: (
      <SpotifyProvider>
        <Outlet />
      </SpotifyProvider>
    ),
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/spotify-redirect",
        element: <SpotifyRedirect />,
      },
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
