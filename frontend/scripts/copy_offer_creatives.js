const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\Yamuna Madhu\\.gemini\\antigravity\\brain\\29246a38-a55c-4131-9f04-130f6a4199ba";
const targetDir = path.join(__dirname, '..', 'public', 'images', 'offers');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const fileMap = {
  "offer_early_bird_v2_1785224943332.jpg": "offer_early_bird.jpg",
  "offer_college_students_v2_1785224956256.jpg": "offer_college_students.jpg",
  "offer_double_dhamaka_v2_1785224971841.jpg": "offer_double_dhamaka.jpg",
  "offer_aadi_special_v2_1785224986356.jpg": "offer_aadi_special.jpg",
  "offer_friendship_day_v2_1785224999795.jpg": "offer_friendship_day.jpg",
  "offer_little_legend_v2_1785225015509.jpg": "offer_little_legend.jpg",
  "offer_birthday_special_1785224762926.jpg": "offer_birthday_special.jpg"
};

for (const [srcName, destName] of Object.entries(fileMap)) {
  const srcPath = path.join(brainDir, srcName);
  const destPath = path.join(targetDir, destName);
  try {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> public/images/offers/${destName}`);
  } catch (err) {
    console.error(`Error copying ${srcName}:`, err);
  }
}
