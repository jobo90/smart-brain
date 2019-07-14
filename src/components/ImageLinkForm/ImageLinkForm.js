import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="f3">
        {
          'This Smart Brain will detect faces in your picture URLs. Give it a try!'
        }
      </p>
      <div className="center">
        <form
          className="form center pa4 br3 shadow-5"
          onSubmit={onButtonSubmit}
        >
          <input
            className="f4 pa2 w-70 center"
            type="text"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            type="submit"
          >
            Detect
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageLinkForm;
