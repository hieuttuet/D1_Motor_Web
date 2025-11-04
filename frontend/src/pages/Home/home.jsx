import React from "react";
import bgHome from "../../assets/icons/bg_home.jpg";
import "../../styles/home.css";

export default function Home() {
  const backgroundStyle = {
    backgroundImage: `url(${bgHome})`,
  };

  return (
    <div style={backgroundStyle} className="home-container">
    </div>
  );
}
