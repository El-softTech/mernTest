const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URL, {
      dbName: "Ujian_online", // Pastikan menggunakan database yang benar
    });

    console.log("✅ MongoDB Connected to:", conn.connection.host);
    console.log("📂 Using Database:", conn.connection.name);

    // Cek collection yang ada di database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("📜 Collections Available:", collections.map(c => c.name));

  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  }
};

connectDb();

module.exports = mongoose;
