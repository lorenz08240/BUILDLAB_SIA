import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Grid, useTexture, DragControls } from '@react-three/drei';
import { buildSteps, componentsData } from '../Build/Build';
import './PCBuilder3D.css';

const COMPOSITE_SCENARIOS = [
  {
    caseId: 'case1', // Montech AIR-903-base
    moboId: 'msi-b450-tomahawk',
    texture: '/textures/case1-B450-TomHawk.png'
  },
  {
    caseId: 'case4', // Lancool 215
    moboId: 'asus-prime-b660m',
    texture: '/textures/case4-Asus-Prime.png'
  },
  {
    caseId: 'case4', // Lancool 215 + MSI B450 Tomahawk
    moboId: 'msi-b450-tomahawk',
    texture: '/textures/case1-B450-TomHawk.png'
  }
];

// This represents the 3D model of a part that was dropped onto the canvas
function PartModel({ part, position, index, placedParts }) {
  const materialRef = useRef();
  
  let texturePath = '/pcbackground.png';
  let isVisible = true;

  if (part.category === 'case') {
    const availableCases = ['case1', 'case4'];
    const placedMobo = placedParts.find(p => p.category === 'motherboard');
    
    if (placedMobo) {
      const scenario = COMPOSITE_SCENARIOS.find(s => s.caseId === part.id && s.moboId === placedMobo.id);
      if (scenario) {
        texturePath = scenario.texture;
      } else if (availableCases.includes(part.id)) {
        texturePath = `/textures/${part.id}.png`;
      }
    } else if (availableCases.includes(part.id)) {
      texturePath = `/textures/${part.id}.png`;
    }
  } else if (part.category === 'motherboard') {
    // Show standalone motherboard texture if no scenario is active
    if (part.id === 'msi-b450-tomahawk') texturePath = '/textures/motherboard2.jpg';
    
    // Hide motherboard if it belongs to a completed composite scenario
    const placedCase = placedParts.find(p => p.category === 'case');
    if (placedCase) {
      const scenario = COMPOSITE_SCENARIOS.find(s => s.caseId === placedCase.id && s.moboId === part.id);
      if (scenario) {
        isVisible = false;
      }
    }
  }

  const texture = useTexture(texturePath);

  // Flash Effect: trigger whenever the texture changes!
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = 0.8; // Start with a solid white flash
    }
  }, [texturePath]);

  // Gradually fade out the flash overlay
  useFrame((state, delta) => {
    if (materialRef.current && materialRef.current.opacity > 0) {
      materialRef.current.opacity -= delta * 3;
    }
  });

  // Dynamic sizes based on category
  let dimensions = [3, 3, 3]; // Default size for smaller components
  if (part.category === 'case') {
    dimensions = [20, 0.5, 24]; 
  } else if (part.category === 'motherboard') {
    dimensions = [14, 0.5, 14]; // Flat board inside the case
  }

  return (
    <DragControls>
      <group position={position} visible={isVisible}>
        {/* Main Model - Basic Material ignores lighting and shows true, bright colors */}
        <mesh>
          <boxGeometry args={dimensions} />
          <meshBasicMaterial 
            map={texture} 
            color="#ffffff" 
            transparent={true} 
          />
        </mesh>
        
        {/* Flash Overlay */}
        <mesh>
          <boxGeometry args={[dimensions[0] + 0.1, dimensions[1] + 0.1, dimensions[2] + 0.1]} />
          <meshBasicMaterial 
            ref={materialRef}
            color="#ffffff" 
            transparent={true} 
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>
    </DragControls>
  );
}

function PCBuilder3D() {
  const navigate = useNavigate();
  
  // History state for Undo/Redo
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const placedParts = history[historyIndex];

  // Custom updater that pushes to history
  const updatePlacedParts = (newParts) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newParts);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) setHistoryIndex(historyIndex - 1);
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) setHistoryIndex(historyIndex + 1);
  };

  const handleClear = () => {
    updatePlacedParts([]);
    setActiveStep(0);
  };

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

      // Replace if category already exists, otherwise add
      const filtered = placedParts.filter(p => p.category !== part.category);
      updatePlacedParts([...filtered, { ...part, uid: Date.now(), position: dropPosition }]);

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
        <div className="sidebar-top-bar">
          <h2>3D Builder</h2>
          <button className="exit-btn" onClick={() => navigate('/')}>✕ Exit</button>
        </div>

        <div className="sidebar-actions-bar">
          <button 
            className="action-btn" 
            onClick={handleUndo} 
            disabled={historyIndex === 0}
            title="Undo"
          >↩ Undo</button>
          <button 
            className="action-btn" 
            onClick={handleRedo} 
            disabled={historyIndex === history.length - 1}
            title="Redo"
          >↪ Redo</button>
          <button 
            className="action-btn clear-btn" 
            onClick={handleClear}
            disabled={placedParts.length === 0}
            title="Clear Build"
          >🗑 Clear</button>
        </div>
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
              <PartModel 
                key={part.uid} 
                part={part} 
                position={part.position} 
                index={index} 
                placedParts={placedParts} 
              />
            ))}
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

export default PCBuilder3D;
