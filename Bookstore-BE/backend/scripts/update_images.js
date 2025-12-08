
const mongoose = require('mongoose');
require('dotenv').config();

const ITEM_MODEL_PATH = '../models/Item'; 
const Item = require(ITEM_MODEL_PATH);

const PLACEHOLDER = 'https://via.placeholder.com/300x450?text=Book+Cover';

async function main() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO_URI;
  if (!uri) {
    console.error('ERROR: set MONGODB_URI (or MONGO_URL) in .env or pass it as env var');
    process.exit(1);
  }

  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const items = await Item.find();
  console.log(`Found ${items.length} items — scanning for local image paths...`);

  let updated = 0;
  for (const it of items) {
    const img = it.itemImage || '';
   
    if (!img || img.startsWith('uploads/') || img.includes('localhost') || img.includes('\\uploads\\') || img.startsWith('/')) {
      it.itemImage = PLACEHOLDER;
      await it.save();
      updated++;
      console.log(`Updated ${it._id} -> placeholder`);
    }
  }

  console.log(`Done. Updated ${updated} items.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  mongoose.disconnect();
  process.exit(1);
});
