import React from 'react';

const steps = ['Placed', 'Preparation', 'Ready', 'Delivered'];

export default function OrderTracker({ status }) {
  const currentStepIndex = steps.indexOf(status);

  return (
    <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
      {steps.map((step, idx) => (
        <div key={step} style={{ textAlign: 'center', flex: 1 }}>
          <div
            style={{
              marginBottom: 8,
              height: 24,
              width: 24,
              borderRadius: '50%',
              backgroundColor: idx <= currentStepIndex ? '#4caf50' : '#ccc',
              margin: '0 auto',
            }}
          />
          <div style={{ color: idx <= currentStepIndex ? '#4caf50' : '#888' }}>{step}</div>
          {idx < steps.length - 1 && (
            <div
              style={{
                height: 4,
                backgroundColor: idx < currentStepIndex ? '#4caf50' : '#ccc',
                margin: '8px auto',
                width: '80%',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
