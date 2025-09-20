import React from 'react';

const TrailerInfoForm: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">Trailer Information</div>
      <div className="card-body">
        <label>Carry Limit:</label>
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
        <label style={{ marginTop: '8px' }}>Carry Limit:</label>
        <input type="text" />
        <div className="button-row">
        <button className="save-btn">Save</button>
      </div>
      </div>
    </div>
  );
};

export default TrailerInfoForm;
