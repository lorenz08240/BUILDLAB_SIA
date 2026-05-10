// BuildLab Compatibility Rules Engine

// UI Alert styles for incompatibility warnings
const alertBoxStyles = `
.alert-box {
  background: rgba(239, 68, 68, 0.15); /* Mas matingkad na red */
  border: 2px solid #ef4444; /* Mas makapal na border */
  padding: 24px;
  border-radius: 20px;
  margin-bottom: 30px;
  animation: pulse 2s infinite; /* Pulsating effect para pansinin */
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}
`;

export const checkCompatibility = (
  currentBuild,
  nextPart,
  allComponents = {}
) => {
  // 1. CPU vs Motherboard (Socket Match)
  if (currentBuild.cpu && nextPart.category === "motherboard") {
    if (currentBuild.cpu.socket_type !== nextPart.socket_type) {
      // Kumuha ng tamang motherboard mula sa listahan
      const available = (allComponents.motherboard || []).filter(
        (m) => m.socket_type === currentBuild.cpu.socket_type
      );
      const suggestion =
        available.length > 0
          ? `Try the ${available[0].name} or ${
              available[1]?.name || "other models"
            }.`
          : "Check our motherboard list for models matching the socket.";

      return {
        compatible: false,
        reason: `Socket Mismatch! CPU is ${currentBuild.cpu.socket_type}, Motherboard is ${nextPart.socket_type}.`,
        tip: suggestion,
      };
    }
  }

  // 2. RAM vs Motherboard (DDR Type)
  if (currentBuild.motherboard && nextPart.category === "ram") {
    if (currentBuild.motherboard.ddr_type !== nextPart.ddr_type) {
      return {
        compatible: false,
        reason: `Memory Type Mismatch! Your motherboard only supports ${currentBuild.motherboard.ddr_type}, but you selected ${nextPart.ddr_type} RAM.`,
        tip: `DDR4 and DDR5 slots are not interchangeable. Please choose ${currentBuild.motherboard.ddr_type} RAM.`,
      };
    }
  }

  // 3. Case vs Motherboard (Form Factor)
  if (currentBuild.case && nextPart.category === "motherboard") {
    const caseSize =
      currentBuild.case.tags.find((t) => ["ATX", "mATX", "ITX"].includes(t)) ||
      "ATX";
    if (caseSize === "ITX" && nextPart.tags.includes("ATX")) {
      return {
        compatible: false,
        reason: `Size Mismatch! Your case is Mini-ITX only; this ATX motherboard is too large to fit.`,
        tip: `Please choose a compact 'mATX' or 'ITX' motherboard.`,
      };
    }
  }

  // 4. GPU Power Requirements vs PSU
  if (currentBuild.gpu && nextPart.category === "psu") {
    const recommendedWattage = (currentBuild.gpu.power_required || 200) + 250;
    if (nextPart.wattage < recommendedWattage) {
      return {
        compatible: false,
        reason: `Insufficient Power! Your system requires ~${recommendedWattage}W for stability, but this PSU provides only ${nextPart.wattage}W.`,
        tip: `We recommend upgrading to a 750W or 850W power supply for better system stability.`,
      };
    }
  }

  return { compatible: true, message: "Compatible! Great selection." };
};
// Calculate total system power requirements
export const calculatePowerRequirements = (build) => {
  let totalWatts = 0;

  if (build.cpu)
    totalWatts += parseInt(
      build.cpu.tags.find((tag) => tag.includes("W"))?.replace("W", "") || "65"
    );
  if (build.gpu) totalWatts += build.gpu.power_required || 150;
  if (build.motherboard) totalWatts += 50; // Base motherboard power
  if (build.ram) totalWatts += 10; // RAM power
  if (build.storage) totalWatts += 10; // Storage power

  // Add 20% overhead for safety
  totalWatts = Math.ceil(totalWatts * 1.2);

  return totalWatts;
};

// Get compatibility summary for all components
export const getCompatibilitySummary = (build, allComponents = {}) => {
  const issues = [];
  const components = Object.entries(build).filter(
    ([key, value]) => value !== null
  );

  // Check all pairwise combinations
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const [cat1, comp1] = components[i];
      const [cat2, comp2] = components[j];

      // Check compatibility in both directions
      const result1 = checkCompatibility(
        { [cat1]: comp1 },
        { ...comp2, category: cat2 },
        allComponents
      );
      const result2 = checkCompatibility(
        { [cat2]: comp2 },
        { ...comp1, category: cat1 },
        allComponents
      );

      if (!result1.compatible) {
        issues.push({
          components: [cat1, cat2],
          issue: result1.reason,
          tip: result1.tip,
        });
      }
      if (!result2.compatible && result2.reason !== result1.reason) {
        issues.push({
          components: [cat2, cat1],
          issue: result2.reason,
          tip: result2.tip,
        });
      }
    }
  }

  return issues;
};

export const findAlternatives = (category, currentBuild, allComponents) => {
  const list = allComponents[category] || [];
  // Filter out components that are incompatible based on the current build
  return list
    .filter((part) => {
      const testBuild = { ...currentBuild, [category]: part };
      const result = checkCompatibility(
        currentBuild,
        { ...part, category },
        allComponents
      );
      return result.compatible;
    })
    .slice(0, 3); // Ibalik ang top 3 alternatives
};
