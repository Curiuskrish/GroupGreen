import React from "react";
import "./AnimatedBanner.css";

const AnimatedBanner = () => {
  return (
    <section className="animated-banner">
      <div className="content">
        <h1>Empowering Farmers with AI 🌾</h1>
        <p>Your Smart Crop & Weather Companion</p>
      </div>
      <div className="wave"></div>
    </section>
  );
};

export default AnimatedBanner;
