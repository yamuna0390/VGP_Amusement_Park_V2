const fs = require('fs');
const path = require('path');

const src = "C:\\Users\\Yamuna Madhu\\.gemini\\antigravity\\brain\\29246a38-a55c-4131-9f04-130f6a4199ba\\.user_uploaded\\media__1785215491611.jpg";
const dest = path.join(__dirname, '..', 'public', 'images', 'rides_video_poster.jpg');

try {
  fs.copyFileSync(src, dest);
  console.log("Successfully copied rides video poster image to public/images/rides_video_poster.jpg");
} catch (err) {
  console.error("Error copying rides video poster image:", err);
}
