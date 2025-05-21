
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState(false);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
    setCaptured(true);
  };

  return (
    <div className="mb-3 text-center">
      {!captured && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: 'user' }}
            className="rounded-3 mb-3 border border-success"
          />
          <button type="button" onClick={capture} className="btn btn-outline-success fw-bold">
            Capture Photo
          </button>
        </>
      )}
      {captured && (
        <button type="button" onClick={() => setCaptured(false)} className="btn btn-outline-danger fw-bold mt-2">
          Retake Photo
        </button>
      )}
    </div>
  );
};

export default WebcamCapture;
