import React from "react";
import spinner from "../assets/spinner.gif";

export default function LoadingIcon({ isLoading }) {
  return isLoading ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img src={spinner} alt="loading..." />
    </div>
  ) : (
    ""
  );
}
