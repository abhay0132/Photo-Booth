import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PreviewPrint.css";

function PreviewPrint() {
  const [photos, setPhotos] = useState([]);
  const [caption, setCaption] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPhotos = JSON.parse(localStorage.getItem("capturedPhotos"));
    if (!storedPhotos || storedPhotos.length !== 3) {
      navigate("/booth");
    } else {
      const formatted = storedPhotos.map((entry) =>
        typeof entry === "string" ? { photo: entry, filter: "none" } : entry
      );
      setPhotos(formatted);

    }
  }, [navigate]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 480;
    const spacing = 10;
    const height = (480 + spacing) * photos.length + 40;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const loadAndDrawImages = async () => {
      for (let i = 0; i < photos.length; i++) {
        const img = new Image();
        img.src = photos[i].photo;

        await new Promise((resolve) => {
          img.onload = () => {
            ctx.filter = photos[i].filter || "none"; // Apply the saved filter
            ctx.drawImage(img, 0, i * (480 + spacing), 480, 480);
            resolve();
          };
        });
      }


      // Add caption at the bottom
      ctx.fillStyle = "#000";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(caption, width / 2, height - 15);

      const imageData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "photobooth_strip.png";
      link.href = imageData;
      link.click();
    };

    loadAndDrawImages();
  };

  const handleRetake = () => {
    navigate("/booth");
  };

  const handleHome=()=>{
    navigate("/");
  }

  return (
    <div className="preview-container">
      <h2>Your Photo Strip</h2>

      <div className="photo-strip-preview">
        {photos.map((photoObj, idx) => (
          <img
            key={idx}
            src={photoObj.photo}
            alt={`snap-${idx}`}
            className="strip-photo"
            style={{
              marginBottom: "10px",
              filter: photoObj.filter || "none",
            }}
          />
        ))}

        <div className="caption-preview">{caption}</div>
      </div>

      <input
        type="text"
        placeholder="Enter caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="caption-input"
      />

      <div className="button-group">
        <button onClick={handleDownload}>Download Strip</button>
        <button onClick={handleRetake}>Retake</button>
        <button onClick={handleHome}>Home</button>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
    </div>
  );
}

export default PreviewPrint;
