import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box, error }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        {error && <p>{error}</p>}
        <img
          id="inputImage"
          alt=""
          src={imageUrl}
          width="500px"
          height="auto"
        />
        {box
          ? box.map((item, key) => (
              <div
                key={key}
                className="bounding-box"
                style={{
                  top: item.topRow,
                  right: item.rightCol,
                  bottom: item.bottomRow,
                  left: item.leftCol
                }}
              />
            ))
          : ''}
      </div>
    </div>
  );
};

export default FaceRecognition;
