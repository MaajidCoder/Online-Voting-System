import mongoose from "mongoose";

const uri = "mongodb+srv://maajidhassan2006_db_user:ellOaUHKhRfBM3Fh@cluster0.ydq95zc.mongodb.net/?appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("Connected to MongoDB successfully");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
