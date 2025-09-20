

import React from 'react';
import TrailerInfoForm from './components/TrailerInfoForm';
import LoadInfoForm from './components/LoadInfoForm';
import './Input-PG.css';

function App() {
  return (
    <div style={{ background: '#8c9292', minHeight: '100vh', padding: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
        <TrailerInfoForm />
        <LoadInfoForm />
      </div>
    </div>
  );
}

export default App
