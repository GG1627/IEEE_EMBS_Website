import React from "react";

const GradientMesh = () => {
  return (
    <div
      className="absolute inset-0 w-full"
      style={{ zIndex: -1, minHeight: "200vh" }}
    >
      {/* Main gradient background */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #f8f8f8, #ffffff)",
        }}
      ></div>

      {/* Large color blobs that extend beyond the viewport */}
      <div
        className="absolute top-0 -left-1/4 w-[1000px] h-[1000px] rounded-full blur-3xl"
        style={{ backgroundColor: "#772583", opacity: "0.15" }}
      ></div>
      <div
        className="absolute top-1/3 -right-1/4 w-[1200px] h-[1200px] rounded-full blur-3xl"
        style={{ backgroundColor: "#00629b", opacity: "0.2" }}
      ></div>
      <div
        className="absolute top-2/3 left-1/4 w-[1000px] h-[1000px] rounded-full blur-3xl"
        style={{ backgroundColor: "#00a3e0", opacity: "0.15" }}
      ></div>

      {/* Additional blobs for more coverage */}
      <div
        className="absolute top-1/2 left-1/3 w-[800px] h-[800px] rounded-full blur-3xl"
        style={{ backgroundColor: "#009ca6", opacity: "0.18" }}
      ></div>
      <div
        className="absolute top-3/4 right-1/3 w-[900px] h-[900px] rounded-full blur-3xl"
        style={{ backgroundColor: "#007377", opacity: "0.2" }}
      ></div>

      {/* Extra blobs with lighter variations */}
      <div
        className="absolute top-1/4 right-1/2 w-[700px] h-[700px] rounded-full blur-3xl"
        style={{ backgroundColor: "#9b4da8", opacity: "0.12" }}
      ></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-[850px] h-[850px] rounded-full blur-3xl"
        style={{ backgroundColor: "#33b8e5", opacity: "0.15" }}
      ></div>

      {/* Magenta blobs */}
      <div
        className="absolute bottom-1/3 left-1/6 w-[950px] h-[950px] rounded-full blur-3xl"
        style={{ backgroundColor: "#a44da0", opacity: "0.17" }}
      ></div>
      <div
        className="absolute top-20 right-10 w-[800px] h-[800px] rounded-full blur-3xl"
        style={{ backgroundColor: "#a44da0", opacity: "0.15" }}
      ></div>
    </div>
  );
};

export default GradientMesh;
