import React from 'react';

interface TrailerInfoFormProps {
  data: {
    carryLimit: string;
    axleCount: string;
    length: string;
    width: string;
    height: string;
    carryLimit2: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
  onSave: () => void;
}

const TrailerInfoForm: React.FC<TrailerInfoFormProps> = ({ data, onChange, onSave }) => {
  return (
    <div className="card">
      <div className="card-header">Trailer Information</div>
      <div className="card-body">
        <label>Carry Limit:</label>
        <input type="number" min="0" value={data.carryLimit} onChange={e => onChange(e, 'carryLimit')} />

        <label>Axle Count:</label>
        <input type="number" min="0" value={data.axleCount} onChange={e => onChange(e, 'axleCount')} />

        <div className="dimensions-row">
          <label>Length:</label>
          <label>Width:</label>
          <label>Height:</label>
        </div>
        <div className="dimensions-row">
          <input type="number" min="0" value={data.length} onChange={e => onChange(e, 'length')} />
          <input type="number" min="0" value={data.width} onChange={e => onChange(e, 'width')} />
          <input type="number" min="0" value={data.height} onChange={e => onChange(e, 'height')} />
        </div>

        <label style={{ marginTop: '8px' }}>Carry Limit:</label>
        <input type="number" min="0" value={data.carryLimit2} onChange={e => onChange(e, 'carryLimit2')} />
        <div className="button-row">
          <button className="save-btn" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default TrailerInfoForm;
