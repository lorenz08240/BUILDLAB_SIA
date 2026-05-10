import React, { createContext, useContext, useEffect, useState } from "react";

// Build Context for managing selected components
const BuildContext = createContext();

const STORAGE_KEY = "buildLabSavedBuilds";

// Build Provider component
export const BuildProvider = ({ children }) => {
  const [currentBuild, setCurrentBuild] = useState({
    cpu: null,
    motherboard: null,
    ram: null,
    storage: null,
    gpu: null,
    psu: null,
    case: null,
  });

  const [compatibilityResults, setCompatibilityResults] = useState([]);
  const [savedBuilds, setSavedBuilds] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored || [null, null, null];
    } catch {
      return [null, null, null];
    }
  });
  const [selectedSaveSlot, setSelectedSaveSlot] = useState(0);

  // Function to add a component to the build
  const addComponent = (category, component) => {
    setCurrentBuild((prev) => ({
      ...prev,
      [category]: component,
    }));
  };

  // Function to remove a component from the build
  const removeComponent = (category) => {
    setCurrentBuild((prev) => ({
      ...prev,
      [category]: null,
    }));
  };

  // Function to reset the full build
  const resetBuild = () => {
    setCurrentBuild({
      cpu: null,
      motherboard: null,
      ram: null,
      storage: null,
      gpu: null,
      psu: null,
      case: null,
    });
    setCompatibilityResults([]);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBuilds));
    } catch {
      // Ignore storage errors.
    }
  }, [savedBuilds]);

  const saveBuildSnapshot = (slotIndex = selectedSaveSlot) => {
    setSavedBuilds((prev) => {
      const newBuilds = [...prev];
      newBuilds[slotIndex] = currentBuild;
      return newBuilds;
    });
  };

  const getSavedBuild = (slotIndex = selectedSaveSlot) => {
    return savedBuilds[slotIndex] || null;
  };

  // Function to get selected components as array
  const getSelectedComponents = () => {
    return Object.entries(currentBuild)
      .filter(([key, value]) => value !== null)
      .map(([category, component]) => ({
        category,
        ...component,
      }));
  };

  return (
    <BuildContext.Provider
      value={{
        currentBuild,
        compatibilityResults,
        savedBuilds,
        selectedSaveSlot,
        setSelectedSaveSlot,
        addComponent,
        removeComponent,
        resetBuild,
        getSelectedComponents,
        saveBuildSnapshot,
        getSavedBuild,
        setCompatibilityResults,
      }}
    >
      {children}
    </BuildContext.Provider>
  );
};

// Custom hook to use build context
export const useBuild = () => {
  const context = useContext(BuildContext);
  if (!context) {
    throw new Error("useBuild must be used within a BuildProvider");
  }
  return context;
};
