import React from "react";
import { useEffect } from "react";
import bgHome from "../../assets/icons/bg_home.jpg";
import "../../styles/home.css";

export default function Home() {
    useEffect(() => {
    document.title = "Home Page";
  }, []);
  const backgroundStyle = {
    backgroundImage: `url(${bgHome})`,
  };

  return (
    <div style={backgroundStyle} className="home-container">
    </div>
  );
}
