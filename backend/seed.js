const mysql = require('mysql2/promise');
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
};

const componentsData = {
  case: [
    {
      id: "case1",
      img: "https://netcodex.ph/wp-content/uploads/2025/04/Air-903-Base-Black-1.webp",
      brand: "Fractal Design",
      name: "Montech AIR-903-base",
      desc: "Excellent airflow case with tempered glass side panel.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower"],
      price: "₱3,500"
    },
    {
      id: "case2",
      img: "https://i.pinimg.com/736x/80/1a/a2/801aa278ac082746e4d985a88a49b050.jpg",
      brand: "Corsair",
      name: "5000T RGB",
      desc: "Premium ATX case with integrated RGB lighting.",
      form_factor: "Full Tower",
      tags: ["Full Tower", "Tempered Glass", "RGB"],
      price: "₱6,200"
    },
    {
      id: "case3",
      img: "https://img.overclockers.co.uk/images/CAS-PHK-02322/2cf0f3d0d8c9ab24eee5cd10713cd601.jpg",
      brand: "NZXT",
      name: "H510 Elite",
      desc: "Clean modern case with cable management.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Tempered Glass", "Clean Design"],
      price: "₱5,500"
    },
    {
      id: "case4",
      img: "https://i.pinimg.com/1200x/1f/59/8f/1f598fb26027a902adf73c58d122f477.jpg",
      brand: "Lian Li",
      name: "Lancool 215",
      desc: "Budget-friendly compact case.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Mesh Front", "Budget"],
      price: "₱6,200"
    },
    {
      id: "case5",
      img: "https://i.pinimg.com/736x/bb/23/bb/bb23bb46c317d5494bab81fe333c6c64.jpg",
      brand: "Phanteks",
      name: "Eclipse P500A D-RGB",
      desc: "Airflow focused case with RGB fans included.",
      form_factor: "Mid Tower",
      tags: ["Mid Tower", "Mesh Front", "RGB Fans"],
      price: "₱11,500"
    }
  ],
  motherboard: [
    {
      id: "asus-prime-b660m",
      img: "https://i.pinimg.com/1200x/aa/7a/b6/aa7ab6601d825d397bdc9a0ef0536107.jpg",
      brand: "ASUS",
      name: "Prime B660M-A",
      desc: "Reliable motherboard for Intel 12th/13th gen CPUs.",
      socket_type: "LGA1700",
      ddr_type: "DDR4",
      tags: ["LGA1700", "DDR4", "mATX"],
      price: "₱8,500"
    },
    {
      id: "msi-b450-tomahawk",
      img: "https://i.pinimg.com/736x/8a/f9/27/8af92772a102ef89c93a1aa1e8ce15b9.jpg",
      brand: "MSI",
      name: "B450 Tomahawk",
      desc: "Great AMD motherboard with excellent VRM design.",
      socket_type: "AM4",
      ddr_type: "DDR4",
      tags: ["AM4", "DDR4", "ATX"],
      price: "₱7,200"
    },
    {
      id: "gigabyte-z690-master",
      img: "https://i.pinimg.com/1200x/f6/23/a4/f623a42b62f1089258d7c126338703ac.jpg",
      brand: "Gigabyte",
      name: "Z690 Master",
      desc: "Premium Intel Z690 board with excellent features.",
      socket_type: "LGA1700",
      ddr_type: "DDR5",
      tags: ["LGA1700", "DDR5", "ATX"],
      price: "₱18,900"
    },
    {
      id: "asus-rog-strix-z690",
      img: "https://i.pinimg.com/736x/03/8b/63/038b634627abdf7d8ffafbb73b6f5055.jpg",
      brand: "ASUS",
      name: "ROG Strix Z690-E",
      desc: "High-end gaming motherboard with PCIe 5.0 support.",
      socket_type: "LGA1700",
      ddr_type: "DDR5",
      tags: ["LGA1700", "DDR5", "ATX"],
      price: "₱28,500"
    },
    {
      id: "msi-x670e-carbon",
      img: "https://i.pinimg.com/736x/62/91/c6/6291c6e431f5d662595c2de0fb6d0037.jpg",
      brand: "MSI",
      name: "X670E Carbon WiFi",
      desc: "Flagship AM5 board with WiFi 6E and premium components.",
      socket_type: "AM5",
      ddr_type: "DDR5",
      tags: ["AM5", "DDR5", "ATX"],
      price: "₱32,800"
    }
  ],
  cpu: [
    {
      id: "intel-i5-13600k",
      img: "https://i.pinimg.com/736x/e6/27/6f/e6276f6f641577e4f0dab89258fb26f4.jpg",
      brand: "Intel",
      name: "Core i5-13600K",
      desc: "Great mid-range CPU for gaming and productivity. 14 cores, 20 threads.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "125W", "14 cores"],
      price: "₱31,900"
    },
    {
      id: "intel-i3-12100",
      img: "https://i.pinimg.com/1200x/2b/94/9f/2b949f97d8310b915e0dcac8634b97ec.jpg",
      brand: "Intel",
      name: "Core i3-12100",
      desc: "Budget-friendly entry-level CPU. Perfect for learning and basic tasks.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "65W", "4 cores"],
      price: "₱6,900"
    },
    {
      id: "intel-i7-13700k",
      img: "https://i.pinimg.com/1200x/e3/e5/fb/e3e5fba9cdd472ce389d419be45c50ab.jpg",
      brand: "Intel",
      name: "Core i7-13700K",
      desc: "High-end CPU for extreme gaming and 4K content creation. 16 cores, 24 threads.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "253W", "16 cores"],
      price: "₱46,500"
    },
    {
      id: "intel-i9-13900k",
      img: "https://i.pinimg.com/736x/2d/ab/2f/2dab2f152ecfdf7e32d887e5e6002217.jpg",
      brand: "Intel",
      name: "Core i9-13900K",
      desc: "Ultimate flagship CPU for professional workloads. 24 cores, 32 threads.",
      socket_type: "LGA1700",
      tags: ["LGA1700", "253W", "24 cores"],
      price: "₱68,900"
    },
    {
      id: "amd-ryzen5-7600x",
      img: "https://i.pinimg.com/1200x/1f/2c/6e/1f2c6e6851d3343b285615ee65ede44c.jpg",
      brand: "AMD",
      name: "Ryzen 5 7600X",
      desc: "High-performance AMD CPU with excellent single-core speed.",
      socket_type: "AM5",
      tags: ["AM5", "105W", "6 cores"],
      price: "₱24,900"
    }
  ],
  ram: [
    {
      id: "corsair-vengeance-16gb",
      img: "https://i.pinimg.com/1200x/d9/ce/16/d9ce160cb4b2b9fe73179f1a976bc8f6.jpg",
      brand: "Corsair",
      name: "Vengeance LPX 16GB DDR4",
      desc: "High-performance DDR4 RAM for gaming and productivity.",
      ddr_type: "DDR4",
      capacity: "16GB",
      speed: "3200MHz",
      tags: ["DDR4", "16GB", "3200MHz"],
      price: "₱3,200"
    },
    {
      id: "corsair-vengeance-32gb",
      img: "https://i.pinimg.com/736x/df/c4/15/dfc4158b5e51522ee5f69be6753f57a1.jpg",
      brand: "Corsair",
      name: "Vengeance LPX 32GB DDR4",
      desc: "High-capacity DDR4 for content creation and multitasking.",
      ddr_type: "DDR4",
      capacity: "32GB",
      speed: "3200MHz",
      tags: ["DDR4", "32GB", "3200MHz"],
      price: "₱6,200"
    },
    {
      id: "gskill-trident-16gb",
      img: "https://i.pinimg.com/1200x/cb/a2/d0/cba2d047802ca9217bf6589265729ace.jpg",
      brand: "G.Skill",
      name: "Trident Z RGB 16GB DDR4",
      desc: "RGB gaming RAM with high performance.",
      ddr_type: "DDR4",
      capacity: "16GB",
      speed: "3600MHz",
      tags: ["DDR4", "16GB", "3600MHz"],
      price: "₱4,100"
    },
    {
      id: "kingston-fury-32gb",
      img: "https://i.pinimg.com/1200x/d8/68/65/d868659c8a8bc94d766fa84e5a40b77f.jpg",
      brand: "Kingston",
      name: "Fury Beast 32GB DDR4",
      desc: "Reliable gaming RAM with excellent compatibility.",
      ddr_type: "DDR4",
      capacity: "32GB",
      speed: "3200MHz",
      tags: ["DDR4", "32GB", "3200MHz"],
      price: "₱5,800"
    },
    {
      id: "corsair-dominator-ddr5-32gb",
      img: "https://i.pinimg.com/1200x/24/32/a7/2432a792587ec1347b7f0b9b952a559f.jpg",
      brand: "Corsair",
      name: "Dominator Platinum RGB DDR5 32GB",
      desc: "Premium DDR5 RAM with blazing speed.",
      ddr_type: "DDR5",
      capacity: "32GB",
      speed: "6000MHz",
      tags: ["DDR5", "32GB", "6000MHz"],
      price: "₱12,500"
    }
  ],
  storage: [
    {
      id: "samsung-970-evo-1tb",
      img: "https://i.pinimg.com/736x/58/aa/35/58aa35cb5ee7f3865cea7c64de7319b7.jpg",
      brand: "Samsung",
      name: "970 EVO 1TB",
      desc: "Fast NVMe SSD for quick boot times and app loading.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 3.0"],
      price: "₱4,500"
    },
    {
      id: "samsung-990-pro-2tb",
      img: "https://i.pinimg.com/1200x/79/a9/77/79a97721ac400b551144f71eb66f55c2.jpg",
      brand: "Samsung",
      name: "990 Pro 2TB",
      desc: "Ultra-fast PCIe 4.0 NVMe for demanding workloads.",
      type: "NVMe SSD",
      capacity: "2TB",
      tags: ["NVMe", "2TB", "PCIe 4.0"],
      price: "₱12,800"
    },
    {
      id: "western-digital-sn850x-1tb",
      img: "https://i.pinimg.com/1200x/07/18/94/0718945252dfc7a100d21ba30da794e7.jpg",
      brand: "Western Digital",
      name: "Black SN850X 1TB",
      desc: "High-performance gaming SSD.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 4.0"],
      price: "₱5,200"
    },
    {
      id: "crucial-p5-plus-1tb",
      img: "https://i.pinimg.com/1200x/7e/10/b8/7e10b88e6fec645fde0db26318870dd2.jpg",
      brand: "Crucial",
      name: "P5 Plus 1TB",
      desc: "Fast and reliable PCIe 4.0 SSD.",
      type: "NVMe SSD",
      capacity: "1TB",
      tags: ["NVMe", "1TB", "PCIe 4.0"],
      price: "₱4,800"
    },
    {
      id: "kingston-fury-2tb",
      img: "https://i.pinimg.com/1200x/ed/61/07/ed61070d535eead4043c944a7f07518c.jpg",
      brand: "Kingston",
      name: "Fury Renegade 2TB",
      desc: "Gaming-focused PCIe 4.0 SSD.",
      type: "NVMe SSD",
      capacity: "2TB",
      tags: ["NVMe", "2TB", "PCIe 4.0"],
      price: "₱11,500"
    }
  ],
  gpu: [
    {
      id: "nvidia-rtx-3060",
      img: "https://i.pinimg.com/736x/d4/2c/7f/d42c7f4d0658d0624457aabd41e39df2.jpg",
      brand: "NVIDIA",
      name: "RTX 3060",
      desc: "Great 1440p gaming GPU with ray tracing support.",
      power_required: 550,
      tags: ["RTX 3060", "12GB", "1440p"],
      price: "₱28,000"
    },
    {
      id: "nvidia-rtx-4070",
      img: "https://i.pinimg.com/736x/50/30/d9/5030d9e580eb97b13de4e51c9d740451.jpg",
      brand: "NVIDIA",
      name: "RTX 4070",
      desc: "Excellent for 1440p ultra and 4K gaming.",
      power_required: 550,
      tags: ["RTX 4070", "12GB", "1440p/4K"],
      price: "₱42,500"
    },
    {
      id: "nvidia-rtx-4090",
      img: "https://i.pinimg.com/1200x/9d/f7/08/9df7084f305d43a3ce3f1b82971e58b4.jpg",
      brand: "NVIDIA",
      name: "RTX 4090",
      desc: "Flagship GPU for 4K gaming and professional workloads.",
      power_required: 850,
      tags: ["RTX 4090", "24GB", "4K Ultra"],
      price: "₱125,000"
    },
    {
      id: "nvidia-rtx-3080",
      img: "https://i.pinimg.com/736x/72/e7/53/72e753dc969a1f0ed99a26ea36895ce1.jpg",
      brand: "NVIDIA",
      name: "RTX 3080",
      desc: "High-end GPU for extreme 4K gaming.",
      power_required: 750,
      tags: ["RTX 3080", "10GB", "4K"],
      price: "₱68,900"
    },
    {
      id: "amd-rx-6800-xt",
      img: "https://i.pinimg.com/1200x/83/e6/51/83e6515f65aabf7666f11422a6dc07e6.jpg",
      brand: "AMD",
      name: "RX 6800 XT",
      desc: "Powerful RDNA 2 GPU for 4K gaming.",
      power_required: 700,
      tags: ["RX 6800 XT", "16GB", "4K"],
      price: "₱65,200"
    }
  ],
  psu: [
    {
      id: "corsair-rm650x",
      img: "https://assets.corsair.com/image/upload/c_pad,q_85,h_1100,w_1100,f_auto/products/Power-Supply-Units/CP-9020178-NA/Gallery/RM650x_PSU_01.webp",
      brand: "Corsair",
      name: "RM650x",
      desc: "80+ Gold certified power supply with modular cables.",
      wattage: 650,
      efficiency: "80+ Gold",
      tags: ["650W", "80+ Gold", "Modular"],
      price: "₱5,800"
    },
    {
      id: "corsair-hx850x",
      img: "https://assets.corsair.com/image/upload/c_pad,q_85,h_360,w_360/products/Power-Supply-Units/CMPSU-850HX/Gallery/hx850_01.webp",
      brand: "Corsair",
      name: "HX850x",
      desc: "Premium 80+ Platinum PSU with excellent efficiency.",
      wattage: 850,
      efficiency: "80+ Platinum",
      tags: ["850W", "80+ Platinum", "Fully Modular"],
      price: "₱9,200"
    },
    {
      id: "seasonic-focus-750",
      img: "https://seasonic.com/wp-content/uploads/2024/07/ATX3.1-FOCUS-GX-Back-Panel-Angled-300x222.webp",
      brand: "Seasonic",
      name: "Focus 750W Gold",
      desc: "Reliable Seasonic quality with 80+ Gold.",
      wattage: 750,
      efficiency: "80+ Gold",
      tags: ["750W", "80+ Gold", "Modular"],
      price: "₱6,500"
    },
    {
      id: "msi-mag-a750gl",
      img: "https://i.pinimg.com/736x/fc/c9/52/fcc952bef5e164f6dac9826b1416980b.jpg",
      brand: "MSI",
      name: "MAG A750GL",
      desc: "Budget-friendly 750W Gold PSU.",
      wattage: 750,
      efficiency: "80+ Gold",
      tags: ["750W", "80+ Gold", "Modular"],
      price: "₱5,900"
    },
    {
      id: "evga-supernova-850",
      img: "https://i.pinimg.com/1200x/4c/a8/60/4ca860f77bc5db2561c5d854def91f36.jpg",
      brand: "EVGA",
      name: "SuperNOVA 850W Gold",
      desc: "Popular choice with excellent support.",
      wattage: 850,
      efficiency: "80+ Gold",
      tags: ["850W", "80+ Gold", "Modular"],
      price: "₱7,200"
    }
  ]
};

async function seed() {
  let connection;
  try {
    // connect without db first to create it
    connection = await mysql.createConnection(dbConfig);
    await connection.query("CREATE DATABASE IF NOT EXISTS BUILDLAB_db");
    console.log("Database created or already exists.");
    await connection.query("USE BUILDLAB_db");

    // Drop table if exists to start fresh
    await connection.query("DROP TABLE IF EXISTS pc_parts");
    
    const createTableQuery = "CREATE TABLE pc_parts ( id VARCHAR(100) PRIMARY KEY, category VARCHAR(50), img VARCHAR(255), brand VARCHAR(100), name VARCHAR(100), `desc` TEXT, price VARCHAR(50), tags JSON, socket_type VARCHAR(50), ddr_type VARCHAR(50), form_factor VARCHAR(50), power_required INT, wattage INT, capacity VARCHAR(50), speed VARCHAR(50), type VARCHAR(50), efficiency VARCHAR(50) )";
    await connection.query(createTableQuery);
    console.log("Table pc_parts created.");

    // Create saved_builds table
    await connection.query("DROP TABLE IF EXISTS saved_builds");
    const createSavedBuildsQuery = "CREATE TABLE saved_builds ( slot_id INT PRIMARY KEY, build_data JSON )";
    await connection.query(createSavedBuildsQuery);
    console.log("Table saved_builds created.");

    // Insert data
    const insertQuery = "INSERT INTO pc_parts ( id, category, img, brand, name, `desc`, price, tags, socket_type, ddr_type, form_factor, power_required, wattage, capacity, speed, type, efficiency ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    for (const category in componentsData) {
      const items = componentsData[category];
      for (const item of items) {
        await connection.query(insertQuery, [
          item.id,
          category,
          item.img || null,
          item.brand || null,
          item.name || null,
          item.desc || null,
          item.price || null,
          JSON.stringify(item.tags || []),
          item.socket_type || null,
          item.ddr_type || null,
          item.form_factor || null,
          item.power_required || null,
          item.wattage || null,
          item.capacity || null,
          item.speed || null,
          item.type || null,
          item.efficiency || null
        ]);
      }
    }
    console.log("Data inserted successfully.");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seed();
