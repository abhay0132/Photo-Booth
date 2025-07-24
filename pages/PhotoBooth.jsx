import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PhotoBooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [countdown, setCountdown] = useState(null);
  const [showMessage, setShowMessage] = useState("");

  // ✅ Get filter from localStorage synchronously
  const savedFilter = useRef(localStorage.getItem("selectedFilter") || "none");

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 480, height: 480 } })
      .then((stream) => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play().catch((err) => console.error("Video play error:", err));
          };
        }
      })
      .catch((err) => console.error("Camera error:", err));
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    startCamera();

    const shots = [];
    let photoIndex = 0;

    const runCaptureSequence = () => {
      if (photoIndex >= 3) {
        localStorage.setItem("capturedPhotos", JSON.stringify(
          shots.map(photo => ({ photo, filter: savedFilter.current }))
        ));
        stopCamera();
        navigate("/preview");
        return;
      }

      let count = 3;
      setCountdown(count);
      setShowMessage("");

      const countdownInterval = setInterval(() => {
        count--;
        if (count > 0) {
          setCountdown(count);
        } else {
          clearInterval(countdownInterval);
          setCountdown(null);
          setShowMessage("Smile!");

          setTimeout(() => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video && canvas) {
              const ctx = canvas.getContext("2d");
              canvas.width = 480;
              canvas.height = 480;

              // ✅ Apply filter here using savedFilter.current
              ctx.filter = savedFilter.current;
              console.log("Applying canvas filter:", savedFilter.current);
              ctx.drawImage(video, 0, 0, 480, 480);

              const photo = canvas.toDataURL("image/png");
              shots.push(photo);
              setShowMessage("");
              photoIndex++;
              setTimeout(runCaptureSequence, 300);
            }
          }, 1000);
        }
      }, 1000);
    };

    runCaptureSequence();

    return () => {
      stopCamera();
    };
  }, [navigate]);

  return (
    <div className="main-container">
      <div className="camera">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="video-feed"
          style={{ filter: savedFilter.current }}
        />
      </div>

      {countdown !== null && <div className="countdown-text">{countdown}</div>}
      {showMessage && <div className="smile-text">{showMessage}</div>}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default PhotoBooth;
