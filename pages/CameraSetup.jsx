import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./CameraSetup.css";

function CameraSetup() {
  const videoRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const navigate = useNavigate();

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 480 } })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
          };
        }
      })
      .catch((err) => {
        console.error("Camera access error:", err);
      });
  };

  useEffect(() => {
    getVideo();
  }, []);

  const handleContinue = () => {
    localStorage.setItem("selectedFilter", selectedFilter);
    navigate("/booth");
  };

  const filters = [
    { name: "None", value: "none" },
    { name: "Noir", value: "grayscale(1)" },
    { name: "Sepia", value: "sepia(1)" },
    { name: "Blur", value: "blur(3px)" },
    { name: "Bright", value: "brightness(1.3)" },
  ];

  return (
    <div className="camera-setup-container">
      <h2>Select a Filter & Get Ready</h2>

      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-feed"
          autoPlay
          muted
          style={{ filter: selectedFilter }}
        ></video>
      </div>

      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedFilter(filter.value)}
            className={
              selectedFilter === filter.value ? "selected-filter" : "filter-btn"
            }
          >
            {filter.name}
          </button>
        ))}
      </div>

      <button className="continue-btn" onClick={handleContinue}>
        Continue →
      </button>
    </div>
  );
}

export default CameraSetup;
