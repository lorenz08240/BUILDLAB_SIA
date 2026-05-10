import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, Grid, useTexture, DragControls } from '@react-three/drei';
import { buildSteps, componentsData } from '../Build/Build';
import './PCBuilder3D.css';

// This represents the 3D model of a part that was dropped onto the canvas
function PartModel({ part, position, index }) {
  // Use a dynamic path based on the part's category!
  // Since you only have case.png right now, we use it for the case,
  // and fallback to pcbackground.png for the other parts so the app doesn't crash.
  const texturePath = part.category === 'case' 
    ? '/textures/case.png' 
    : '/pcbackground.png';

  const texture = useTexture(texturePath);

  // Dynamic sizes based on category
  let dimensions = [3, 3, 3]; // Default size for smaller components
  if (part.category === 'case') {
    // Make the case thin (0.5) so it acts like a flat 2D canvas on the floor.
    // Dimensions [20, Z=24] give it a rectangular aspect ratio to prevent squishing.
    dimensions = [20, 0.5, 24]; 
  } else if (part.category === 'motherboard') {
    dimensions = [14, 0.5, 14]; // Flat board inside the case
  }

  return (
    <DragControls>
      <mesh position={position}>
        <boxGeometry args={dimensions} />
        {/* The map property applies the texture to all sides of the box */}
        <meshStandardMaterial map={texture} color="#ffffff" />
      </mesh>
    </DragControls>
  );
}

function PCBuilder3D() {
  const [placedParts, setPlacedParts] = useState([]);
  const [activeStep, setActiveStep] = useState(0); // 0 is PC Case

  const handleDragStart = (e, part, category) => {
    e.dataTransfer.setData('part', JSON.stringify({ ...part, category }));
  };

  const handleDragOver = (e) => {
    e.preventDefault(); 
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const partData = e.dataTransfer.getData('part');
    if (partData) {
      const part = JSON.parse(partData);
      
      // Determine height based on category so it sits correctly on the grid
      let heightY = 1.5; // Half of 3
      if (part.category === 'case') heightY = 5; // Half of 10
      else if (part.category === 'motherboard') heightY = 0.25; // Half of 0.5
      
      // Calculate a semi-random drop position so smaller parts don't perfectly overlap
      let dropPosition = [
        (Math.random() - 0.5) * 10,
        heightY, 
        (Math.random() - 0.5) * 10
      ];

      // If it's a Case or Motherboard, place it perfectly in the center!
      if (part.category === 'case' || part.category === 'motherboard') {
        dropPosition = [0, heightY, 0];
      }

      setPlacedParts(prev => {
        // Replace if category already exists, otherwise add
        const filtered = prev.filter(p => p.category !== part.category);
        return [...filtered, { ...part, uid: Date.now(), position: dropPosition }];
      });

      // Unlock next step if the dropped part belongs to the CURRENT active step
      const stepIndex = buildSteps.findIndex(s => s.key === part.category);
      if (stepIndex === activeStep && activeStep < buildSteps.length - 1) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  const isStepLocked = (stepIndex) => {
    if (stepIndex === 0) return false;
    // It's locked if the PREVIOUS step's category is NOT in placedParts
    const previousCategory = buildSteps[stepIndex - 1].key;
    return !placedParts.some(p => p.category === previousCategory);
  };

  return (
    <div className="pc-builder-container">
      {/* Sidebar for Dragging Parts */}
      <div className="parts-sidebar">
        <h2>3D Builder</h2>
        <p className="sidebar-hint">Drag parts into the 3D grid in order.</p>

        <div className="accordion-container">
          {buildSteps.map((step, index) => {
            const isLocked = isStepLocked(index);
            const isExpanded = activeStep === index;
            const stepComponents = componentsData[step.key] || [];
            const isCompleted = placedParts.some(p => p.category === step.key);

            return (
              <div key={step.key} className={`accordion-item ${isLocked ? 'locked' : ''} ${isExpanded ? 'expanded' : ''}`}>
                <div 
                  className="accordion-header"
                  onClick={() => !isLocked && setActiveStep(index)}
                >
                  <div className="accordion-title">
                    <span className="step-icon">{isCompleted ? "✓" : step.icon}</span>
                    {step.label}
                  </div>
                  <div className="accordion-status">
                    {isLocked ? "🔒" : isExpanded ? "▼" : "▶"}
                  </div>
                </div>
                
                <div className="accordion-content-wrapper">
                  <div className="accordion-content">
                    <div className="components-2col-grid">
                      {stepComponents.map((comp) => (
                        <div
                          key={comp.id}
                          className="draggable-comp-card"
                          draggable
                          onDragStart={(e) => handleDragStart(e, comp, step.key)}
                        >
                          <img src={comp.img} alt={comp.name} />
                          <div className="comp-info">
                            <span className="comp-brand">{comp.brand}</span>
                            <span className="comp-name">{comp.name}</span>
                            <span className="comp-price">{comp.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div 
        className="canvas-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Canvas>
          {/* Larger Grid View, Adjust Zoom to fit */}
          <OrthographicCamera 
            makeDefault 
            position={[0, 10, 0]} 
            zoom={25} 
            rotation={[-Math.PI / 2, 0, 0]} 
          />
          
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} />
          
          <Grid 
            args={[30, 30]} 
            cellSize={1} 
            cellThickness={1} 
            cellColor="#4b5563" 
            sectionSize={5} 
            sectionThickness={1.5} 
            sectionColor="#facc15" 
            fadeDistance={50} 
            fadeStrength={1} 
            position={[0, 0, 0]}
          />

          <Suspense fallback={null}>
            {placedParts.map((part, index) => (
              <PartModel key={part.uid} part={part} position={part.position} index={index} />
            ))}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default PCBuilder3D;
