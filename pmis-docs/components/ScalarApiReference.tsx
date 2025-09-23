import React from 'react';

interface ScalarApiReferenceProps {
  url: string;
  title?: string;
  height?: string;
}

export default function ScalarApiReference({ 
  url, 
  title, 
  height = "800px" 
}: ScalarApiReferenceProps) {
  return (
    <div className="scalar-container my-6">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <iframe 
        src={url}
        width="100%" 
        height={height}
        style={{ 
          border: 'none', 
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
        }}
        title={title || "API Reference"}
      />
    </div>
  );
}
