import React from 'react';

interface LoadInfoFormProps {
  onAdd?: () => void;
  expanded?: boolean;
  onHeaderClick?: () => void;
  cardIndex?: number;
  data: {
    loadAmount: string;
    axleCount: string;
    length: string;
    width: string;
    height: string;
    maxStackHeight: string;
    saved?: any;
  };
  onChange: (field: string, value: string) => void;
  onSave: () => void;
}

const LoadInfoForm: React.FC<LoadInfoFormProps> = ({ cardIndex, onAdd, expanded = true, onHeaderClick, data, onChange, onSave }) => {
  return (
    <div className="card">
      <div
        className="card-header"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        onClick={onHeaderClick}
      >
        <span>Load Information</span>
        <span
          style={{
            fontSize: '1em',
            background: '#fff',
            color: '#2364AA',
            borderRadius: '50%',
            width: '1.7em',
            height: '1.7em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px',
            fontWeight: 'bold',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }}
        >
          {cardIndex}
        </span>
      </div>
      {expanded && (
        <div className="card-body">
          <label>Load Amount:</label>
          <input type="number" min="0" value={data.loadAmount} onChange={e => onChange('loadAmount', e.target.value)} />
          <label>Axle Count:</label>
          <input type="number" min="0" value={data.axleCount} onChange={e => onChange('axleCount', e.target.value)} />
          <div className="dimensions-row">
            <label>Length:</label>
            <label>Width:</label>
            <label>Height:</label>
          </div>
          <div className="dimensions-row">
            <input type="number" min="0" value={data.length} onChange={e => onChange('length', e.target.value)} />
            <input type="number" min="0" value={data.width} onChange={e => onChange('width', e.target.value)} />
            <input type="number" min="0"  value={data.height} onChange={e => onChange('height', e.target.value)} />
          </div>
          <label style={{ marginTop: '8px' }}>Load Max Stack Height:</label>
          <input type="number" min="0" value={data.maxStackHeight} onChange={e => onChange('maxStackHeight', e.target.value)} />
          <div className="button-row">
            <button className="add-btn" onClick={onAdd}>+</button>
            <button className="save-btn" onClick={onSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadInfoForm;
