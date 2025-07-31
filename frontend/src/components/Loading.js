import React from 'react';

function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading">
      <div style={{ marginBottom: '1rem' }}>
        <img 
          src="/rbc-logo-placeholder.svg" 
          alt="RBC" 
          style={{ width: '60px', opacity: 0.3 }}
        />
      </div>
      {message}
    </div>
  );
}

export default Loading;
