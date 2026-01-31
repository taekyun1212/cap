import React from 'react';

function MyButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {text}
    </button>
  );
}

export default MyButton;
