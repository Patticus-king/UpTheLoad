
import { useNavigate } from "react-router-dom";
import React from 'react';
import TrailerInfoForm from './components/TrailerInfoForm';
import LoadInfoForm from './components/LoadInfoForm';
import './Input-PG.css';

type TrailerData = {
  carryLimit: string;
  axleCount: string;
  length: string;
  width: string;
  height: string;
  carryLimit2: string;
};

type LoadData = {
  loadAmount: string;
  axleCount: string;
  length: string;
  width: string;
  height: string;
  maxStackHeight: string;
  saved?: {
    loadAmount: string;
    axleCount: string;
    length: string;
    width: string;
    height: string;
    maxStackHeight: string;
  };
};

function App() {
  const navigate = useNavigate();
  // Trailer form state
  const [trailerData, setTrailerData] = React.useState<TrailerData>({
    carryLimit: '',
    axleCount: '',
    length: '',
    width: '',
    height: '',
    carryLimit2: ''
  });
  const [trailerSaved, setTrailerSaved] = React.useState<TrailerData | null>(null);

  // Load cards state
  const [loadCards, setLoadCards] = React.useState<LoadData[]>([
    {
      loadAmount: '',
      axleCount: '',
      length: '',
      width: '',
      height: '',
      maxStackHeight: ''
    }
  ]);
  const [expandedIdx, setExpandedIdx] = React.useState<number>(0);

  // Add new load card
  const addLoadCard = () => {
    setLoadCards([
      ...loadCards,
      {
        loadAmount: '',
        axleCount: '',
        length: '',
        width: '',
        height: '',
        maxStackHeight: ''
      }
    ]);
    setExpandedIdx(loadCards.length);
  };

  // Expand/collapse handler
  const handleExpand = (idx: number) => {
    setExpandedIdx(idx);
  };

  // Save handlers
  const handleTrailerSave = () => {
    setTrailerSaved({ ...trailerData });
  };
  const handleTrailerChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setTrailerData({ ...trailerData, [field]: e.target.value });
  };

  const handleLoadChange = (idx: number, field: string, value: string) => {
    const newCards = [...loadCards];
    (newCards[idx] as any)[field] = value;
    setLoadCards(newCards);
  };
  const handleLoadSave = (idx: number) => {
    const newCards = [...loadCards];
    newCards[idx].saved = {
      loadAmount: newCards[idx].loadAmount,
      axleCount: newCards[idx].axleCount,
      length: newCards[idx].length,
      width: newCards[idx].width,
      height: newCards[idx].height,
      maxStackHeight: newCards[idx].maxStackHeight
    };
    setLoadCards(newCards);
  };

  return (
    <div style={{ background: '#8c9292', minHeight: '100vh', padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
        <div style={{ alignSelf: 'flex-start' }}>
          <TrailerInfoForm
            data={trailerData}
            onChange={handleTrailerChange}
            onSave={handleTrailerSave}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loadCards.map((card, idx) => (
            <React.Fragment key={idx}>
              <LoadInfoForm
                cardIndex={idx + 1}
                onAdd={addLoadCard}
                expanded={expandedIdx === idx}
                onHeaderClick={() => handleExpand(idx)}
                data={card}
                onChange={(field, value) => handleLoadChange(idx, field, value)}
                onSave={() => handleLoadSave(idx)}
              />
              {/* Notification box removed as requested */}
            </React.Fragment>
          ))}
        </div>
      </div>
      <button className="save-btn" onClick={() => navigate('/')}>Go back</button>
    </div>
  );
}
export default App
