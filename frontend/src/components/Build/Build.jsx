import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useBuild } from "../../contexts/BuildContext";
import { checkCompatibility } from "../../utilities/rules";
import "./Build.css";

const buildSteps = [
  { key: "cpu", label: "CPU (Processor)", icon: "⚙️", description: "The brain of your PC" },
  { key: "motherboard", label: "Motherboard", icon: "💻", description: "Connects all components" },
  { key: "ram", label: "RAM (Memory)", icon: "💾", description: "Temporary data storage" },
  { key: "storage", label: "Storage", icon: "🗄️", description: "Permanent data storage" },
  { key: "gpu", label: "GPU (Graphics Card)", icon: "🎮", description: "Handles graphics and gaming" },
  { key: "psu", label: "Power Supply (PSU)", icon: "⚡", description: "Powers your entire system" },
  { key: "case", label: "PC Case", icon: "🧱", description: "Houses all components" },
];

const componentsData = {
  cpu: [
    {
      id: "intel-i5-13600k",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
      alt: "Intel Core i3-12100",
      brand: "Intel",
      name: "Core i3-12100",
      desc: "Budget-friendly entry-level CPU. Perfect for learning and basic tasks.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "60W", "4 cores"],
      price: "₱12,900",
    },
    {
      id: "intel-i7-13700k",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "AMD Ryzen 5 7600X",
      brand: "AMD",
      name: "Ryzen 5 7600X",
      desc: "High-performance AMD CPU with excellent single-core speed.",
      socket_type: "AM5",
      tags: ["AM5", "105W", "6 cores"],
      price: "₱24,900",
    },
    {
      id: "amd-ryzen3-4100",
      img: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=300&q=80",
      alt: "AMD Ryzen 3 4100",
      brand: "AMD",
      name: "Ryzen 3 4100",
      desc: "Entry-level AMD CPU, great for budget builds and learning.",
      socket_type: "AM4",
      tags: ["AM4", "65W", "4 cores"],
      price: "₱8,900",
    },
    {
      id: "amd-ryzen7-7700x",
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "AMD Ryzen 7 7700X",
      brand: "AMD",
      name: "Ryzen 7 7700X",
      desc: "Excellent multi-core performance for streaming and content creation.",
      socket_type: "AM5",
      tags: ["AM5", "105W", "8 cores"],
      price: "₱34,200",
    },
    {
      id: "amd-ryzen9-7950x",
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "AMD Ryzen 9 7950X",
      brand: "AMD",
      name: "Ryzen 9 7950X",
      desc: "Top-tier CPU with 16 cores for professional workloads.",
      socket_type: "AM5",
      tags: ["AM5", "170W", "16 cores"],
      price: "₱52,800",
    },
    {
      id: "intel-i5-12400",
      img: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&q=80",
      alt: "Intel Core i5-12400",
      brand: "Intel",
      name: "Core i5-12400",
      desc: "Solid mid-range CPU for gaming and everyday use.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "65W", "6 cores"],
      price: "₱18,500",
    },
    {
      id: "amd-ryzen5-5600x",
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "AMD Ryzen 5 5600X",
      brand: "AMD",
      name: "Ryzen 5 5600X",
      desc: "Previous generation CPU still great for 1080p gaming.",
      socket_type: "AM4",
      tags: ["AM4", "65W", "6 cores"],
      price: "₱15,800",
    },
    {
      id: "intel-i3-13100",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
      alt: "Intel Core i3-13100",
      brand: "Intel",
      name: "Core i3-13100",
      desc: "Budget CPU perfect for office work and light gaming.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "60W", "4 cores"],
      price: "₱11,200",
    },
  ],
  motherboard: [
    {
      id: "asus-prime-b660m",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "MSI X670E Carbon WiFi",
      brand: "MSI",
      name: "X670E Carbon WiFi",
      desc: "Flagship AM5 board with WiFi 6E and premium components.",
      socket_type: "AM5",
      ddr_type: "DDR5",
      tags: ["AM5", "DDR5", "ATX"],
      price: "₱32,800",
    },
    {
      id: "asrock-b660m-phantom",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
      alt: "ASRock B660M Phantom",
      brand: "ASRock",
      name: "B660M Phantom",
      desc: "Budget-friendly B660 with solid features.",
      socket_type: "LGA1700",
      ddr_type: "DDR4",
      tags: ["LGA1700", "DDR4", "mATX"],
      price: "₱6,800",
    },
    {
      id: "gigabyte-b650-aorus",
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "Gigabyte B650 Aorus Master",
      brand: "Gigabyte",
      name: "B650 Aorus Master",
      desc: "Mid-range AM5 board with great value.",
      socket_type: "AM5",
      ddr_type: "DDR5",
      tags: ["AM5", "DDR5", "ATX"],
      price: "₱22,500",
    },
    {
      id: "asus-prime-b550",
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "ASUS Prime B550",
      brand: "ASUS",
      name: "Prime B550-Plus",
      desc: "Solid B550 board for Ryzen 3000/5000 series.",
      socket_type: "AM4",
      ddr_type: "DDR4",
      tags: ["AM4", "DDR4", "ATX"],
      price: "₱9,200",
    },
    {
      id: "msi-z790-edge-wifi",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
      alt: "MSI Z790 Edge WiFi",
      brand: "MSI",
      name: "Z790 Edge WiFi",
      desc: "Premium Z790 board with WiFi 6E.",
      socket_type: "LGA1700",
      ddr_type: "DDR5",
      tags: ["LGA1700", "DDR5", "ATX"],
      price: "₱26,800",
    },
    {
      id: "asrock-x870-steel-legend",
      img: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=300&q=80",
      alt: "ASRock X870 Steel Legend",
      brand: "ASRock",
      name: "X870 Steel Legend",
      desc: "Latest generation AM5 with PCIe 5.0.",
      socket_type: "AM5",
      ddr_type: "DDR5",
      tags: ["AM5", "DDR5", "ATX"],
      price: "₱35,200",
    },
    {
      id: "gigabyte-h770-aorus-pro",
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80",
      alt: "Gigabyte H770 Aorus Pro",
      brand: "Gigabyte",
      name: "H770 Aorus Pro",
      desc: "Mid-range Intel board with excellent features.",
      socket_type: "LGA1700",
      ddr_type: "DDR5",
      tags: ["LGA1700", "DDR5", "ATX"],
      price: "₱19,800",
    },
  ],
  ram: [
    {
      id: "corsair-vengeance-16gb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
    {
      id: "gskill-trident-ddr5-16gb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "G.Skill Trident Z5 16GB DDR5",
      brand: "G.Skill",
      name: "Trident Z5 RGB 16GB DDR5",
      desc: "High-speed DDR5 for next-gen systems.",
      ddr_type: "DDR5",
      capacity: "16GB",
      speed: "6000MHz",
      tags: ["DDR5", "16GB", "6000MHz"],
      price: "₱7,200",
    },
    {
      id: "patriot-viper-16gb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Patriot Viper Steel 16GB",
      brand: "Patriot",
      name: "Viper Steel 16GB DDR4",
      desc: "Budget-friendly gaming RAM.",
      ddr_type: "DDR4",
      capacity: "16GB",
      speed: "3200MHz",
      tags: ["DDR4", "16GB", "3200MHz"],
      price: "₱2,800",
    },
    {
      id: "crucial-ballistix-32gb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Crucial Ballistix 32GB",
      brand: "Crucial",
      name: "Ballistix 32GB DDR4",
      desc: "Reliable RAM for gaming and workstations.",
      ddr_type: "DDR4",
      capacity: "32GB",
      speed: "3600MHz",
      tags: ["DDR4", "32GB", "3600MHz"],
      price: "₱6,500",
    },
    {
      id: "kingston-fury-ddr5-16gb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Kingston Fury Beast DDR5 16GB",
      brand: "Kingston",
      name: "Fury Beast DDR5 16GB",
      desc: "Entry-level DDR5 RAM.",
      ddr_type: "DDR5",
      capacity: "16GB",
      speed: "5600MHz",
      tags: ["DDR5", "16GB", "5600MHz"],
      price: "₱6,800",
    },
    {
      id: "corsair-vengeance-rgb-pro-16gb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Corsair Vengeance RGB PRO 16GB",
      brand: "Corsair",
      name: "Vengeance RGB PRO 16GB DDR4",
      desc: "Stunning RGB RAM with solid performance.",
      ddr_type: "DDR4",
      capacity: "16GB",
      speed: "3600MHz",
      tags: ["DDR4", "16GB", "3600MHz"],
      price: "₱4,500",
    },
    {
      id: "adata-xpg-32gb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "ADATA XPG Spectrix 32GB",
      brand: "ADATA",
      name: "XPG Spectrix D45G 32GB DDR4",
      desc: "High-speed gaming RAM with RGB.",
      ddr_type: "DDR4",
      capacity: "32GB",
      speed: "3600MHz",
      tags: ["DDR4", "32GB", "3600MHz"],
      price: "₱6,800",
    },
  ],
  storage: [
    {
      id: "samsung-970-evo-1tb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Kingston Fury Renegade 2TB",
      brand: "Kingston",
      name: "Fury Renegade 2TB",
      desc: "Gaming-focused PCIe 4.0 SSD.",
      type: "NVMe SSD",
      capacity: "2TB",
      tags: ["NVMe", "2TB", "PCIe 4.0"],
      price: "₱11,500",
    },
    {
      id: "seagate-barracuda-2tb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Seagate Barracuda 2TB",
      brand: "Seagate",
      name: "Barracuda 2TB HDD",
      desc: "Reliable mechanical storage for mass data.",
      type: "HDD",
      capacity: "2TB",
      tags: ["HDD", "2TB", "7200RPM"],
      price: "₱2,200",
    },
    {
      id: "western-digital-blue-ssd-1tb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "WD Blue 1TB SSD",
      brand: "Western Digital",
      name: "Blue 1TB SSD",
      desc: "Budget SATA SSD for general use.",
      type: "SATA SSD",
      capacity: "1TB",
      tags: ["SATA", "1TB", "2.5inch"],
      price: "₱3,500",
    },
    {
      id: "adata-xpg-gen5-2tb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "ADATA XPG Lian 2TB",
      brand: "ADATA",
      name: "XPG Lian Platinum 2TB",
      desc: "PCIe 5.0 SSD for future-proof builds.",
      type: "NVMe SSD",
      capacity: "2TB",
      tags: ["NVMe", "2TB", "PCIe 5.0"],
      price: "₱18,500",
    },
    {
      id: "samsung-870-evo-1tb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Samsung 870 EVO 1TB",
      brand: "Samsung",
      name: "870 EVO 1TB",
      desc: "Reliable SATA SSD for upgrades.",
      type: "SATA SSD",
      capacity: "1TB",
      tags: ["SATA", "1TB", "2.5inch"],
      price: "₱4,200",
    },
    {
      id: "corsair-mp600-1tb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Corsair MP600 Core 1TB",
      brand: "Corsair",
      name: "MP600 Core 1TB",
      desc: "Good budget PCIe 4.0 option.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 4.0"],
      price: "₱4,600",
    },
    {
      id: "gigabyte-aorus-1tb",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Gigabyte AORUS 1TB",
      brand: "Gigabyte",
      name: "AORUS Gen4 1TB",
      desc: "Gaming-optimized PCIe 4.0 SSD.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 4.0"],
      price: "₱5,100",
    },
  ],
  gpu: [
    {
      id: "nvidia-rtx-3060",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "AMD RX 6800 XT",
      brand: "AMD",
      name: "RX 6800 XT",
      desc: "Powerful RDNA 2 GPU for 4K gaming.",
      power_required: 700,
      tags: ["RX 6800 XT", "16GB", "4K"],
      price: "₱65,200",
    },
    {
      id: "nvidia-rtx-4060",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "NVIDIA RTX 4060",
      brand: "NVIDIA",
      name: "RTX 4060",
      desc: "Budget-friendly GPU for 1080p gaming.",
      power_required: 350,
      tags: ["RTX 4060", "8GB", "1080p"],
      price: "₱19,800",
    },
    {
      id: "nvidia-rtx-4080",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "NVIDIA RTX 4080",
      brand: "NVIDIA",
      name: "RTX 4080",
      desc: "Premium 4K gaming GPU.",
      power_required: 750,
      tags: ["RTX 4080", "16GB", "4K"],
      price: "₱85,500",
    },
    {
      id: "amd-rx-7800-xt",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "AMD RX 7800 XT",
      brand: "AMD",
      name: "RX 7800 XT",
      desc: "Latest generation GPU for solid 1440p/4K gaming.",
      power_required: 700,
      tags: ["RX 7800 XT", "16GB", "1440p/4K"],
      price: "₱48,900",
    },
    {
      id: "intel-arc-a770",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Intel Arc A770",
      brand: "Intel",
      name: "Arc A770",
      desc: "Intel's entry into discrete GPUs.",
      power_required: 450,
      tags: ["Arc A770", "8GB", "1440p"],
      price: "₱22,500",
    },
    {
      id: "nvidia-rtx-3070",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "NVIDIA RTX 3070",
      brand: "NVIDIA",
      name: "RTX 3070",
      desc: "Great mid-range GPU for 1440p high settings.",
      power_required: 650,
      tags: ["RTX 3070", "8GB", "1440p"],
      price: "₱45,200",
    },
    {
      id: "amd-rx-6600",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "AMD RX 6600",
      brand: "AMD",
      name: "RX 6600",
      desc: "Budget 1080p gaming GPU.",
      power_required: 400,
      tags: ["RX 6600", "8GB", "1080p"],
      price: "₱15,800",
    },
  ],
  psu: [
    {
      id: "corsair-rm650x",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
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
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "EVGA SuperNOVA 850W",
      brand: "EVGA",
      name: "SuperNOVA 850W Gold",
      desc: "Popular choice with excellent support.",
      wattage: 850,
      efficiency: "80+ Gold",
      tags: ["850W", "80+ Gold", "Modular"],
      price: "₱7,200",
    },
    {
      id: "gigabyte-p850gm",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "Gigabyte P850GM",
      brand: "Gigabyte",
      name: "P850GM",
      desc: "Solid 850W Gold modular PSU.",
      wattage: 850,
      efficiency: "80+ Gold",
      tags: ["850W", "80+ Gold", "Modular"],
      price: "₱7,500",
    },
    {
      id: "thermaltake-toughpower-1050",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "Thermaltake Toughpower 1050W",
      brand: "Thermaltake",
      name: "Toughpower 1050W Platinum",
      desc: "High-wattage Platinum PSU for extreme builds.",
      wattage: 1050,
      efficiency: "80+ Platinum",
      tags: ["1050W", "80+ Platinum", "Modular"],
      price: "₱12,500",
    },
    {
      id: "corsair-sf750",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "Corsair SF750",
      brand: "Corsair",
      name: "SF750",
      desc: "Compact 750W Gold PSU for small builds.",
      wattage: 750,
      efficiency: "80+ Gold",
      tags: ["750W", "80+ Gold", "Small Form Factor"],
      price: "₱8,500",
    },
    {
      id: "be-quiet-straight-power-550",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "Be Quiet Straight Power 550W",
      brand: "Be Quiet",
      name: "Straight Power 550W Gold",
      desc: "Quiet and efficient 550W PSU.",
      wattage: 550,
      efficiency: "80+ Gold",
      tags: ["550W", "80+ Gold", "Modular"],
      price: "₱4,800",
    },
    {
      id: "asus-rog-strix-gold-850",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "ASUS ROG Strix Gold 850W",
      brand: "ASUS",
      name: "ROG Strix Gold 850W",
      desc: "Gaming-focused 850W Platinum PSU.",
      wattage: 850,
      efficiency: "80+ Platinum",
      tags: ["850W", "80+ Platinum", "Modular"],
      price: "₱11,800",
    },
    {
      id: "phanteks-revolt-pro-850",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "Phanteks Revolt Pro 850W",
      brand: "Phanteks",
      name: "Revolt Pro 850W Gold",
      desc: "High-quality 850W with great design.",
      wattage: 850,
      efficiency: "80+ Gold",
      tags: ["850W", "80+ Gold", "Modular"],
      price: "₱7,800",
    },
  ],
  case: [
    {
      id: "fractal-design-meshify-c",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Fractal Design Meshify C",
      brand: "Fractal Design",
      name: "Meshify C",
      desc: "Excellent airflow case with tempered glass side panel.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Tempered Glass", "Good Airflow"],
      price: "₱4,200",
    },
    {
      id: "corsair-5000t",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Corsair 5000T",
      brand: "Corsair",
      name: "5000T RGB",
      desc: "Premium ATX case with integrated RGB lighting.",
      form_factor: "Full Tower",
      tags: ["Full Tower", "Tempered Glass", "RGB"],
      price: "₱12,500",
    },
    {
      id: "nzxt-h510-elite",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "NZXT H510 Elite",
      brand: "NZXT",
      name: "H510 Elite",
      desc: "Clean modern case with cable management.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Tempered Glass", "Clean Design"],
      price: "₱5,800",
    },
    {
      id: "lian-li-lancool-215",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Lian Li Lancool 215",
      brand: "Lian Li",
      name: "Lancool 215",
      desc: "Budget-friendly compact case.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Mesh Front", "Budget"],
      price: "₱2,800",
    },
    {
      id: "phanteks-eclipse-p500a",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Phanteks Eclipse P500A",
      brand: "Phanteks",
      name: "Eclipse P500A D-RGB",
      desc: "Airflow focused case with RGB fans included.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Mesh Front", "RGB Fans"],
      price: "₱7,200",
    },
    {
      id: "thermaltake-level-20-ht",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Thermaltake Level 20 HT",
      brand: "Thermaltake",
      name: "Level 20 HT",
      desc: "Unique modular design for enthusiasts.",
      form_factor: "Full Tower",
      tags: ["Full Tower", "Modular", "Unique"],
      price: "₱15,800",
    },
    {
      id: "cooler-master-masterbox-nr600",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Cooler Master MasterBox NR600",
      brand: "Cooler Master",
      name: "MasterBox NR600",
      desc: "Good airflow mid-tower case.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Mesh Front", "Airflow"],
      price: "₱3,500",
    },
    {
      id: "seasonic-connects-tempered-glass",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Seasonic Connects",
      brand: "Seasonic",
      name: "Connects Tempered Glass",
      desc: "Compact case with beautiful design.",
      form_factor: "Mini Tower",
      tags: ["Mini Tower", "Tempered Glass", "Compact"],
      price: "₱4,200",
    },
    {
      id: "corsair-crystal-570x",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Corsair Crystal 570X",
      brand: "Corsair",
      name: "Crystal 570X RGB",
      desc: "Stunning glass panel case for showcase builds.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Glass Panels", "RGB"],
      price: "₱8,900",
    },
    {
      id: "be-quiet-dark-base-901",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Be Quiet Dark Base 901",
      brand: "Be Quiet",
      name: "Dark Base 901",
      desc: "Noise-dampening mid-tower case.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Silent", "Sound-Dampening"],
      price: "₱6,800",
    },
    {
      id: "corsair-1000d-airflow",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "Corsair 1000D Airflow",
      brand: "Corsair",
      name: "1000D Airflow",
      desc: "Massive full-tower for extreme builds.",
      form_factor: "Full Tower",
      tags: ["Full Tower", "Large", "Airflow"],
      price: "₱18,500",
    },
    {
      id: "nzxt-h710i",
      img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&q=80",
      alt: "NZXT H710i",
      brand: "NZXT",
      name: "H710i",
      desc: "Premium mid-tower with smart hub.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Smart Hub", "RGB"],
      price: "₱9,500",
    },
  ],
};

function Build() {
  const { currentBuild, addComponent, removeComponent, getSelectedComponents } = useBuild();
  const [currentStep, setCurrentStep] = useState(0);
  const [compatibilityMessage, setCompatibilityMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedComponents = getSelectedComponents();

  const handleComponentSelect = (component) => {
    const category = buildSteps[currentStep].key;
    const compatibility = checkCompatibility(currentBuild, { ...component, category });

    if (compatibility.compatible) {
      addComponent(category, component);
      setCompatibilityMessage({ type: "success", text: compatibility.message });
      setTimeout(() => setCompatibilityMessage(null), 3000);
    } else {
      setCompatibilityMessage({ type: "error", text: compatibility.reason });
      setTimeout(() => setCompatibilityMessage(null), 5000);
    }
  };

  const handleNext = () => {
    if (currentStep < buildSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentCategory = buildSteps[currentStep].key;
  const currentComponents = componentsData[currentCategory] || [];
  const selectedComponent = currentBuild[currentCategory];
  const currentStepData = buildSteps[currentStep];

  // Filter components based on search query
  const filteredComponents = currentComponents.filter((component) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      component.name.toLowerCase().includes(searchLower) ||
      component.brand.toLowerCase().includes(searchLower) ||
      component.desc.toLowerCase().includes(searchLower) ||
      component.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="build-page">
      <div className="build-hero">
        <div className="build-hero-content">
          <span className="build-badge">⚙ Component Builder</span>
          <h1>Build Your Perfect PC</h1>
          <p>
            Select components step by step. BuildLab checks compatibility in real-time
            and guides you through the entire process.
          </p>
        </div>
      </div>

      {/* Compatibility Message */}
      {compatibilityMessage && (
        <div className={`compatibility-banner ${compatibilityMessage.type}`}>
          <div className="banner-content">
            <span className="banner-icon">
              {compatibilityMessage.type === "success" ? "✅" : "⚠️"}
            </span>
            <p>{compatibilityMessage.text}</p>
          </div>
        </div>
      )}

      <div className="build-main">
        <div className="build-sidebar">
          <div className="sidebar-card">
            <h3>Build Steps</h3>
            <div className="step-list">
              {buildSteps.map((step, index) => (
                <div
                  key={step.key}
                  className={`step-item ${index === currentStep ? "active" : ""} ${currentBuild[step.key] ? "completed" : ""}`}
                  onClick={() => setCurrentStep(index)}
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
                      <span className="component-category">{comp.category}</span>
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
          </div>

          <div className="sidebar-actions">
            <Link to="/summary" className="btn-secondary">View Summary</Link>
            <Link to="/compatibility" className="btn-outline">Check Compatibility</Link>
          </div>
        </div>

        <div className="build-content">
          <div className="step-header">
            <div className="step-info">
              <div className="step-number">Step {currentStep + 1} of {buildSteps.length}</div>
              <h2>{currentStepData.label}</h2>
              <p>{currentStepData.description}</p>
            </div>
            <div className="step-navigation">
              <button
                className="nav-btn prev"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                ← Previous
              </button>
              <button
                className="nav-btn next"
                onClick={handleNext}
                disabled={currentStep === buildSteps.length - 1}
              >
                Next →
              </button>
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
                {filteredComponents.length} result{filteredComponents.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div className="components-grid">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                className={`component-card ${selectedComponent?.id === component.id ? "selected" : ""}`}
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
                    {component.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <div className="component-footer">
                    <span className="component-price">{component.price}</span>
                    <span className="component-status">
                      {selectedComponent?.id === component.id ? "✓ Selected" : "Click to select"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="build-footer">
            <Link to="/summary" className="btn-view-summary">View Your Build Summary →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Build;