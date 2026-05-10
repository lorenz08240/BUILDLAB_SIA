import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBuild } from "../../contexts/BuildContext";
import "./Build.css";

const buildSteps = [
  {
    key: "case",
    label: "PC Case",
    icon: "🧱",
    description: "Houses all components",
  },
  {
    key: "motherboard",
    label: "Motherboard",
    icon: "💻",
    description: "Connects all components",
  },
  {
    key: "cpu",
    label: "CPU (Processor)",
    icon: "⚙️",
    description: "The brain of your PC",
  },
  {
    key: "ram",
    label: "RAM (Memory)",
    icon: "💾",
    description: "Temporary data storage",
  },
  {
    key: "storage",
    label: "Storage",
    icon: "🗄️",
    description: "Permanent data storage",
  },
  {
    key: "gpu",
    label: "GPU (Graphics Card)",
    icon: "🎮",
    description: "Handles graphics and gaming",
  },
  {
    key: "psu",
    label: "Power Supply (PSU)",
    icon: "⚡",
    description: "Powers your entire system",
  },
];
const componentsData = {
  case: [
    {
      id: "case1",
      img: "https://netcodex.ph/wp-content/uploads/2025/04/Air-903-Base-Black-1.webp",
      alt: "Fractal Design Meshify C",
      brand: "Fractal Design",
      name: "Montech AIR-903-base",
      desc: "Excellent airflow case with tempered glass side panel.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower"],
      price: "₱3,500,",
    },
    {
      id: "case2",
      img: "https://i.pinimg.com/736x/80/1a/a2/801aa278ac082746e4d985a88a49b050.jpg",
      alt: "Corsair 5000T",
      brand: "Corsair",
      name: "5000T RGB",
      desc: "Premium ATX case with integrated RGB lighting.",
      form_factor: "Full Tower",
      tags: ["Full Tower", "Tempered Glass", "RGB"],
      price: "₱6,200",
    },
    {
      id: "case3",
      img: "https://img.overclockers.co.uk/images/CAS-PHK-02322/2cf0f3d0d8c9ab24eee5cd10713cd601.jpg",
      brand: "NZXT",
      name: "H510 Elite",
      desc: "Clean modern case with cable management.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Tempered Glass", "Clean Design"],
      price: "₱5,500",
    },
    {
      id: "case4",
      img: "https://i.pinimg.com/1200x/1f/59/8f/1f598fb26027a902adf73c58d122f477.jpg",
      alt: "Lian Li Lancool 215",
      brand: "Lian Li",
      name: "Lancool 215",
      desc: "Budget-friendly compact case.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Mesh Front", "Budget"],
      price: "₱6,200",
    },
    {
      id: "case5",
      img: "https://i.pinimg.com/1200x/f7/01/87/f70187bac1a9faf14497d74db0edfb32.jpg",
      alt: "Phanteks Eclipse P500A",
      brand: "Phanteks",
      name: "Eclipse P500A D-RGB",
      desc: "Airflow focused case with RGB fans included.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Mesh Front", "RGB Fans"],
      price: "₱11,500",
    },
  ],
  motherboard: [
    {
      id: "asus-prime-b660m",
      img: "https://i.pinimg.com/1200x/aa/7a/b6/aa7ab6601d825d397bdc9a0ef0536107.jpg",
      alt: "ASUS Prime B660M-A",
      brand: "ASUS",
      name: "Prime B660M-A",
      desc: "Reliable motherboard for Intel 12th/13th gen CPUs.",
      socket_type: "LGA1700",
      ddr_type: "DDR4",
      tags: ["LGA1700", "DDR4", "mATX"],
      price: "₱8,500",
    },
    {
      id: "msi-b450-tomahawk",
      img: "https://i.pinimg.com/736x/8a/f9/27/8af92772a102ef89c93a1aa1e8ce15b9.jpg",
      alt: "MSI B450 Tomahawk",
      brand: "MSI",
      name: "B450 Tomahawk",
      desc: "Great AMD motherboard with excellent VRM design.",
      socket_type: "AM4",
      ddr_type: "DDR4",
      tags: ["AM4", "DDR4", "ATX"],
      price: "₱7,200",
    },
    {
      id: "gigabyte-z690-master",
      img: "https://i.pinimg.com/1200x/f6/23/a4/f623a42b62f1089258d7c126338703ac.jpg",
      alt: "Gigabyte Z690 Master",
      brand: "Gigabyte",
      name: "Z690 Master",
      desc: "Premium Intel Z690 board with excellent features.",
      socket_type: "LGA1700",
      ddr_type: "DDR5",
      tags: ["LGA1700", "DDR5", "ATX"],
      price: "₱18,900",
    },
    {
      id: "asus-rog-strix-z690",
      img: "https://i.pinimg.com/736x/03/8b/63/038b634627abdf7d8ffafbb73b6f5055.jpg",
      alt: "ASUS ROG Strix Z690",
      brand: "ASUS",
      name: "ROG Strix Z690-E",
      desc: "High-end gaming motherboard with PCIe 5.0 support.",
      socket_type: "LGA1700",
      ddr_type: "DDR5",
      tags: ["LGA1700", "DDR5", "ATX"],
      price: "₱28,500",
    },
    {
      id: "msi-x670e-carbon",
      img: "https://i.pinimg.com/736x/62/91/c6/6291c6e431f5d662595c2de0fb6d0037.jpg",
      alt: "MSI X670E Carbon WiFi",
      brand: "MSI",
      name: "X670E Carbon WiFi",
      desc: "Flagship AM5 board with WiFi 6E and premium components.",
      socket_type: "AM5",
      ddr_type: "DDR5",
      tags: ["AM5", "DDR5", "ATX"],
      price: "₱32,800",
    },
  ],
  cpu: [
    {
      id: "intel-i5-13600k",
      img: "https://i.pinimg.com/736x/e6/27/6f/e6276f6f641577e4f0dab89258fb26f4.jpg",
      alt: "Intel Core i5-13600K",
      brand: "Intel",
      name: "Core i5-13600K",
      desc: "Great mid-range CPU for gaming and productivity. 14 cores, 20 threads.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "125W", "14 cores"],
      price: "₱31,900",
    },
    {
      id: "intel-i3-12100",
      img: "https://i.pinimg.com/1200x/2b/94/9f/2b949f97d8310b915e0dcac8634b97ec.jpg",
      alt: "Intel Core i3-12100",
      brand: "Intel",
      name: "Core i3-12100",
      desc: "Budget-friendly entry-level CPU. Perfect for learning and basic tasks.",
      socket_type: "LGA1700",
      tags: "2,900",
    },
    {
      id: "intel-i7-13700k",
      img: "https://i.pinimg.com/1200x/e3/e5/fb/e3e5fba9cdd472ce389d419be45c50ab.jpg",
      alt: "Intel Core i7-13700K",
      brand: "Intel",
      name: "Core i7-13700K",
      desc: "High-end CPU for extreme gaming and 4K content creation. 16 cores, 24 threads.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "253W", "16 cores"],
      price: "₱46,500",
    },
    {
      id: "intel-i9-13900k",
      img: "https://i.pinimg.com/736x/2d/ab/2f/2dab2f152ecfdf7e32d887e5e6002217.jpg",
      alt: "Intel Core i9-13900K",
      brand: "Intel",
      name: "Core i9-13900K",
      desc: "Ultimate flagship CPU for professional workloads. 24 cores, 32 threads.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "253W", "24 cores"],
      price: "₱68,900",
    },
    {
      id: "amd-ryzen5-7600x",
      img: "https://i.pinimg.com/1200x/1f/2c/6e/1f2c6e6851d3343b285615ee65ede44c.jpg",
      alt: "AMD Ryzen 5 7600X",
      brand: "AMD",
      name: "Ryzen 5 7600X",
      desc: "High-performance AMD CPU with excellent single-core speed.",
      socket_type: "AM5",
      tags: ["AM5", "105W", "6 cores"],
      price: "₱24,900",
    },
  ],
  ram: [
    {
      id: "corsair-vengeance-16gb",
      img: "https://i.pinimg.com/1200x/d9/ce/16/d9ce160cb4b2b9fe73179f1a976bc8f6.jpg",
      alt: "Corsair Vengeance LPX 16GB",
      brand: "Corsair",
      name: "Vengeance LPX 16GB DDR4",
      desc: "High-performance DDR4 RAM for gaming and productivity.",
      ddr_type: "DDR4",
      capacity: "16GB",
      speed: "3200MHz",
      tags: ["DDR4", "16GB", "3200MHz"],
      price: "₱3,200",
    },
    {
      id: "corsair-vengeance-32gb",
      img: "https://i.pinimg.com/736x/df/c4/15/dfc4158b5e51522ee5f69be6753f57a1.jpg",
      alt: "Corsair Vengeance LPX 32GB",
      brand: "Corsair",
      name: "Vengeance LPX 32GB DDR4",
      desc: "High-capacity DDR4 for content creation and multitasking.",
      ddr_type: "DDR4",
      capacity: "32GB",
      speed: "3200MHz",
      tags: ["DDR4", "32GB", "3200MHz"],
      price: "₱6,200",
    },
    {
      id: "gskill-trident-16gb",
      img: "https://i.pinimg.com/1200x/cb/a2/d0/cba2d047802ca9217bf6589265729ace.jpg",
      alt: "G.Skill Trident Z RGB 16GB",
      brand: "G.Skill",
      name: "Trident Z RGB 16GB DDR4",
      desc: "RGB gaming RAM with high performance.",
      ddr_type: "DDR4",
      capacity: "16GB",
      speed: "3600MHz",
      tags: ["DDR4", "16GB", "3600MHz"],
      price: "₱4,100",
    },
    {
      id: "kingston-fury-32gb",
      img: "https://i.pinimg.com/1200x/d8/68/65/d868659c8a8bc94d766fa84e5a40b77f.jpg",
      alt: "Kingston Fury Beast 32GB",
      brand: "Kingston",
      name: "Fury Beast 32GB DDR4",
      desc: "Reliable gaming RAM with excellent compatibility.",
      ddr_type: "DDR4",
      capacity: "32GB",
      speed: "3200MHz",
      tags: ["DDR4", "32GB", "3200MHz"],
      price: "₱5,800",
    },
    {
      id: "corsair-dominator-ddr5-32gb",
      img: "https://i.pinimg.com/1200x/24/32/a7/2432a792587ec1347b7f0b9b952a559f.jpg",
      alt: "Corsair Dominator DDR5 32GB",
      brand: "Corsair",
      name: "Dominator Platinum RGB DDR5 32GB",
      desc: "Premium DDR5 RAM with blazing speed.",
      ddr_type: "DDR5",
      capacity: "32GB",
      speed: "6000MHz",
      tags: ["DDR5", "32GB", "6000MHz"],
      price: "₱12,500",
    },
  ],
  storage: [
    {
      id: "samsung-970-evo-1tb",
      img: "https://i.pinimg.com/736x/58/aa/35/58aa35cb5ee7f3865cea7c64de7319b7.jpg",
      alt: "Samsung 970 EVO 1TB",
      brand: "Samsung",
      name: "970 EVO 1TB",
      desc: "Fast NVMe SSD for quick boot times and app loading.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 3.0"],
      price: "₱4,500",
    },
    {
      id: "samsung-990-pro-2tb",
      img: "https://i.pinimg.com/1200x/79/a9/77/79a97721ac400b551144f71eb66f55c2.jpg",
      alt: "Samsung 990 Pro 2TB",
      brand: "Samsung",
      name: "990 Pro 2TB",
      desc: "Ultra-fast PCIe 4.0 NVMe for demanding workloads.",
      type: "NVMe SSD",
      capacity: "2TB",
      tags: ["NVMe", "2TB", "PCIe 4.0"],
      price: "₱12,800",
    },
    {
      id: "western-digital-sn850x-1tb",
      img: "https://i.pinimg.com/1200x/07/18/94/0718945252dfc7a100d21ba30da794e7.jpg",
      alt: "WD Black SN850X 1TB",
      brand: "Western Digital",
      name: "Black SN850X 1TB",
      desc: "High-performance gaming SSD.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 4.0"],
      price: "₱5,200",
    },
    {
      id: "crucial-p5-plus-1tb",
      img: "https://i.pinimg.com/1200x/7e/10/b8/7e10b88e6fec645fde0db26318870dd2.jpg",
      alt: "Crucial P5 Plus 1TB",
      brand: "Crucial",
      name: "P5 Plus 1TB",
      desc: "Fast and reliable PCIe 4.0 SSD.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 4.0"],
      price: "₱4,800",
    },
    {
      id: "kingston-fury-2tb",
      img: "https://i.pinimg.com/1200x/ed/61/07/ed61070d535eead4043c944a7f07518c.jpg",
      alt: "Kingston Fury Renegade 2TB",
      brand: "Kingston",
      name: "Fury Renegade 2TB",
      desc: "Gaming-focused PCIe 4.0 SSD.",
      type: "NVMe SSD",
      capacity: "2TB",
      tags: ["NVMe", "2TB", "PCIe 4.0"],
      price: "₱11,500",
    },
  ],
  gpu: [
    {
      id: "nvidia-rtx-3060",
      img: "https://i.pinimg.com/736x/d4/2c/7f/d42c7f4d0658d0624457aabd41e39df2.jpg",
      alt: "NVIDIA RTX 3060",
      brand: "NVIDIA",
      name: "RTX 3060",
      desc: "Great 1440p gaming GPU with ray tracing support.",
      power_required: 550,
      tags: ["RTX 3060", "12GB", "1440p"],
      price: "₱28,000",
    },
    {
      id: "nvidia-rtx-4070",
      img: "https://i.pinimg.com/736x/50/30/d9/5030d9e580eb97b13de4e51c9d740451.jpg",
      alt: "NVIDIA RTX 4070",
      brand: "NVIDIA",
      name: "RTX 4070",
      desc: "Excellent for 1440p ultra and 4K gaming.",
      power_required: 550,
      tags: ["RTX 4070", "12GB", "1440p/4K"],
      price: "₱42,500",
    },
    {
      id: "nvidia-rtx-4090",
      img: "https://i.pinimg.com/1200x/9d/f7/08/9df7084f305d43a3ce3f1b82971e58b4.jpg",
      alt: "NVIDIA RTX 4090",
      brand: "NVIDIA",
      name: "RTX 4090",
      desc: "Flagship GPU for 4K gaming and professional workloads.",
      power_required: 850,
      tags: ["RTX 4090", "24GB", "4K Ultra"],
      price: "₱125,000",
    },
    {
      id: "nvidia-rtx-3080",
      img: "https://i.pinimg.com/736x/72/e7/53/72e753dc969a1f0ed99a26ea36895ce1.jpg",
      alt: "NVIDIA RTX 3080",
      brand: "NVIDIA",
      name: "RTX 3080",
      desc: "High-end GPU for extreme 4K gaming.",
      power_required: 750,
      tags: ["RTX 3080", "10GB", "4K"],
      price: "₱68,900",
    },
    {
      id: "amd-rx-6800-xt",
      img: "https://i.pinimg.com/1200x/83/e6/51/83e6515f65aabf7666f11422a6dc07e6.jpg",
      alt: "AMD RX 6800 XT",
      brand: "AMD",
      name: "RX 6800 XT",
      desc: "Powerful RDNA 2 GPU for 4K gaming.",
      power_required: 700,
      tags: ["RX 6800 XT", "16GB", "4K"],
      price: "₱65,200",
    },
  ],
  psu: [
    {
      id: "corsair-rm650x",
      img: "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Power-Supply-Units/CP-9020178-NA/Gallery/RM650x_PSU_01.webp",
      alt: "Corsair RM650x",
      brand: "Corsair",
      name: "RM650x",
      desc: "80+ Gold certified power supply with modular cables.",
      wattage: 650,
      efficiency: "80+ Gold",
      tags: ["650W", "80+ Gold", "Modular"],
      price: "₱5,800",
    },
    {
      id: "corsair-hx850x",
      img: "https://assets.corsair.com/image/upload/c_pad,q_85,h_360,w_360/products/Power-Supply-Units/CMPSU-850HX/Gallery/hx850_01.webp",
      alt: "Corsair HX850x",
      brand: "Corsair",
      name: "HX850x",
      desc: "Premium 80+ Platinum PSU with excellent efficiency.",
      wattage: 850,
      efficiency: "80+ Platinum",
      tags: ["850W", "80+ Platinum", "Fully Modular"],
      price: "₱9,200",
    },
    {
      id: "seasonic-focus-750",
      img: "https://seasonic.com/wp-content/uploads/2024/07/ATX3.1-FOCUS-GX-Back-Panel-Angled-300x222.webp",
      alt: "Seasonic Focus 750W",
      brand: "Seasonic",
      name: "Focus 750W Gold",
      desc: "Reliable Seasonic quality with 80+ Gold.",
      wattage: 750,
      efficiency: "80+ Gold",
      tags: ["750W", "80+ Gold", "Modular"],
      price: "₱6,500",
    },
    {
      id: "msi-mag-a750gl",
      img: "https://i.pinimg.com/736x/fc/c9/52/fcc952bef5e164f6dac9826b1416980b.jpg",
      alt: "MSI MAG A750GL",
      brand: "MSI",
      name: "MAG A750GL",
      desc: "Budget-friendly 750W Gold PSU.",
      wattage: 750,
      efficiency: "80+ Gold",
      tags: ["750W", "80+ Gold", "Modular"],
      price: "₱5,900",
    },
    {
      id: "evga-supernova-850",
      img: "https://i.pinimg.com/1200x/4c/a8/60/4ca860f77bc5db2561c5d854def91f36.jpg",
      alt: "EVGA SuperNOVA 850W",
      brand: "EVGA",
      name: "SuperNOVA 850W Gold",
      desc: "Popular choice with excellent support.",
      wattage: 850,
      efficiency: "80+ Gold",
      tags: ["850W", "80+ Gold", "Modular"],
      price: "₱7,200",
    },
  ],
};

function Build() {
  const { currentBuild, addComponent, removeComponent, getSelectedComponents } =
    useBuild();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedComponents = getSelectedComponents();

  // Calculate Total Price
  const totalPrice = selectedComponents.reduce((sum, comp) => {
    const priceString =
      typeof comp.price === "string" ? comp.price.replace(/[₱,]/g, "") : "0";
    return sum + (parseFloat(priceString) || 0);
  }, 0);

  const handleComponentSelect = (component) => {
    const category = buildSteps[currentStep].key;
    addComponent(category, component);

    // Automatically move to the next step
    if (currentStep < buildSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isStepLocked = (stepIndex) => {
    // Lock steps based on the previous step's completion
    if (stepIndex > 0) {
      const previousStepKey = buildSteps[stepIndex - 1].key;
      return !currentBuild[previousStepKey];
    }
    return false;
  };

  const currentCategory = buildSteps[currentStep].key;
  const currentComponents = componentsData[currentCategory] || [];
  const selectedComponent = currentBuild[currentCategory];
  const currentStepData = buildSteps[currentStep];

  // Filter components based on search query
  const filteredComponents = currentComponents.filter((component) => {
    const searchLower = searchQuery.toLowerCase();
    // Safely check if tags exists and is an array before using .some()
    const tagsMatch = Array.isArray(component.tags)
      ? component.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      : typeof component.tags === "string" &&
        component.tags.toLowerCase().includes(searchLower);
    return (
      component.name.toLowerCase().includes(searchLower) ||
      component.brand.toLowerCase().includes(searchLower) ||
      component.desc.toLowerCase().includes(searchLower) ||
      tagsMatch
    );
  });

  return (
    <div className="build-page">
      <div className="hero-landing">
        <div className="hero-landing-content">
          <div className="hero-text-side">
            <h1>Build Your Perfect PC</h1>
            <p>
              Customize every detail of your setup with our intelligent builder.
              High-performance gaming is just a few clicks away.
            </p>
            <button
              className="btn-start-now"
              onClick={() =>
                document
                  .getElementById("build-main-area")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              START NOW
            </button>
          </div>
          <div className="hero-image-side">
            <img src="pcbackground.png" alt="Featured Gaming PC" />
          </div>
        </div>
      </div>

      {/* Add the ID 'build-main-area' here for smooth scroll */}
      <div className="build-main" id="build-main-area"></div>
      <div className="build-main">
        <div className="build-sidebar">
          <div className="sidebar-card">
            <h3>Build Steps</h3>
            <div className="step-list">
              {buildSteps.map((step, index) => (
                <div
                  key={step.key}
                  className={`step-item ${
                    index === currentStep ? "active" : ""
                  } ${currentBuild[step.key] ? "completed" : ""} ${
                    isStepLocked(index) ? "locked" : ""
                  }`}
                  onClick={() => !isStepLocked(index) && setCurrentStep(index)}
                >
                  <div className="step-icon">
                    {currentBuild[step.key] ? "✓" : step.icon}
                  </div>
                  <div className="step-content">
                    <div className="step-title">{step.label}</div>
                    <div className="step-desc">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Selected Components</h3>
            <div className="selected-components">
              {selectedComponents.length === 0 ? (
                <p className="no-components">No components selected yet</p>
              ) : (
                selectedComponents.map((comp) => (
                  <div key={comp.category} className="selected-component">
                    <div className="component-info">
                      <span className="component-category">
                        {comp.category}
                      </span>
                      <span className="component-name">{comp.name}</span>
                    </div>
                    <button
                      className="remove-component"
                      onClick={() => removeComponent(comp.category)}
                      title="Remove component"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            {selectedComponents.length > 0 && (
              <div className="total-price-section">
                <span className="total-label">Total Price</span>
                <span className="total-value">
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="sidebar-actions">
            <Link to="/compatibility" className="btn-outline">
              Check Compatibility
            </Link>
          </div>
        </div>

        <div className="build-content">
          <div className="step-header">
            <div className="step-info">
              <div className="step-number">
                Step {currentStep + 1} of {buildSteps.length}
              </div>
              <h2>{currentStepData.label}</h2>
              <span className="step-sub-label">
                {currentStepData.description.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder={`Search ${currentStepData.label.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
            {searchQuery && (
              <span className="search-results-count">
                {filteredComponents.length} result
                {filteredComponents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="components-grid">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                className={`component-card ${
                  selectedComponent?.id === component.id ? "selected" : ""
                }`}
                onClick={() => handleComponentSelect(component)}
              >
                <div className="component-image">
                  <img src={component.img} alt={component.alt} />
                </div>
                <div className="component-details">
                  <div className="component-brand">{component.brand}</div>
                  <h3 className="component-name">{component.name}</h3>
                  <p className="component-description">{component.desc}</p>
                  <div className="component-tags">
                    {Array.isArray(component.tags) &&
                      component.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                  </div>
                  <div className="component-footer">
                    <span className="component-price">{component.price}</span>
                    <span className="component-status">
                      {selectedComponent?.id === component.id
                        ? "✓ Selected"
                        : "Click to select"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Build;
