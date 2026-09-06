import React from 'react';
import '../styles/frame.css';

export default function FramedWindow({ children }) {
  return (
    <div className="framed-viewport">
      <div className="framed-window">
        {children}
      </div>
    </div>
  );
}
