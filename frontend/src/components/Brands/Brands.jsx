import React from "react";
import { Link } from "react-router-dom";
import "./Brands.css";

const brandData = [
  { id: 1, name: "RAKK", logo: "https://cdn.shopify.com/s/files/1/0101/4864/2879/files/RAKK.png?v=1700623403", link: "" },
  { id: 2, name: "Intel", logo: "https://cdn.shopify.com/s/files/1/0101/4864/2879/files/INTEL.png?v=1700623403", link: "" },
  { id: 3, name: "Brand Name", logo: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/5ef7ae157139041.6374208316174.png", link: "" },
  { id: 4, name: "Brand Name", logo: "https://cdn.shopify.com/s/files/1/0101/4864/2879/files/NVIDIA.png?v=1701397751", link: "" },
  { id: 5, name: "Brand Name", logo: "https://cdn.shopify.com/s/files/1/0101/4864/2879/files/MSI.png?v=1700623403", link: "" },
  { id: 6, name: "Brand Name", logo: "https://cdn.shopify.com/s/files/1/0101/4864/2879/files/ASUS_ed526605-d39e-4f9f-8e89-70e59635b47c.png?v=1701928127", link: "" },
  { id: 7, name: "Brand Name", logo: "https://cdn.shopify.com/s/files/1/0101/4864/2879/files/COOLERMASTER.png?v=1700623403", link: "" },
  { id: 8, name: "Brand Name", logo: "https://cdn.shopify.com/s/files/1/0101/4864/2879/files/APPLE.png?v=1701137969", link: "" },
];

function Brands() {
  return (
    <div className="brands-page">
      <div className="brands-header">
        <h1>All Supported Brands</h1>
        <div className="brands-description">
          <p>
            At BUILDLAB, we bring together a curated selection of the most trusted and high-performance brands in the tech industry. From industry leaders like Intel, AMD, and NVIDIA to reliable names such as ASUS, MSI, Corsair, and more   every brand featured is carefully chosen to ensure quality, performance, and compatibility for your PC build.
          </p>
          <p>
            Whether you're building a powerful gaming setup or a reliable workstation, our platform helps you discover components that match your needs. Explore a wide range of CPUs, GPUs, motherboards, memory, storage, and peripherals all from brands you can trust.
          </p>
          <p>
            We make it simple to compare and explore options, so you can confidently choose the right parts for your build. BUILDLAB is designed to guide you every step of the way making PC building easier, smarter, and more accessible.
          </p>
          <p>
            Start exploring and build with confidence.
          </p>
        </div>
      </div>

      {/* Grid of brands */}
      <div className="brands-showcase-grid">
        {brandData.map((brand) => (
          <div key={brand.id} className="brand-logo-card">
            <img src={brand.logo} alt={brand.name} className="brand-logo-img" />
          </div>
        ))}
      </div>

      <div className="brands-footer">
        <Link to="/learn" className="btn-outline">Back to Learn</Link>
      </div>
    </div>
  );
}

export default Brands;