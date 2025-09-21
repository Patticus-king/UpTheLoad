import React from 'react';

const LoadInfoForm: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">Load Information</div>
      <div className="card-body">
        <label>Load Amount:</label>
        <input type="text" />
        <label>Axle Count:</label>
        <input type="text" />
        <div className="dimensions-row">
          <label>Length:</label>
          <label>Width:</label>
          <label>Height:</label>
        </div>
        <div className="dimensions-row">
          <input type="text" />
          <input type="text" />
          <input type="text" />
        </div>
        <label style={{ marginTop: '8px' }}>Load Max Stack Height:</label>
        <input type="text" />
        <div className="button-row">
          <button className="add-btn">+</button>
          <button className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
};

export default LoadInfoForm;
