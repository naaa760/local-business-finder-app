// This is a utility script to create category icons - run once to generate SVG files

const fs = require("fs");
const path = require("path");

const categories = [
  "restaurant",
  "retail",
  "service",
  "entertainment",
  "health",
];
const colors = {
  restaurant: "#e74c3c",
  retail: "#3498db",
  service: "#2ecc71",
  entertainment: "#9b59b6",
  health: "#1abc9c",
};

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, "../../public/icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create an SVG icon for each category
categories.forEach((category) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
    <circle cx="16" cy="16" r="14" fill="${colors[category]}"/>
    <text x="16" y="20" font-family="Arial" font-size="12" text-anchor="middle" fill="white">${category[0].toUpperCase()}</text>
  </svg>`;

  fs.writeFileSync(path.join(iconsDir, `${category}.svg`), svg);
  console.log(`Created icon for ${category}`);
});

console.log("All category icons created");
