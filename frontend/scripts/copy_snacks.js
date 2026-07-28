const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\Yamuna Madhu\\.gemini\\antigravity\\brain\\29246a38-a55c-4131-9f04-130f6a4199ba\\.user_uploaded\\media__1785212493852.png";
const dest = path.join(__dirname, '..', 'public', 'images', 'snacks.png');

try {
  fs.copyFileSync(src, dest);
  console.log("Successfully copied snacks image to public/images/snacks.png");
} catch (err) {
  console.error("Error copying snacks image:", err);
}
