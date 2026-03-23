import mongoose from "mongoose";

const uri = "mongodb+srv://maajidhassan2006_db_user:ellOaUHKhRfBM3Fh@cluster0.ydq95zc.mongodb.net/?appName=Cluster0";

const electionSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: String,
}, { strict: false });

const Election = mongoose.model("Election", electionSchema);

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB successfully");
    
    // Find elections matching "Tech Fest 2026"
    const elections = await Election.find({ title: /tech fest 2026/i });
    console.log("Found elections:", elections);
    
    // Delete them
    if (elections.length > 0) {
      const result = await Election.deleteMany({ title: /tech fest 2026/i });
      console.log(`Deleted ${result.deletedCount} elections.`);
    } else {
      console.log("No elections found with that name.");
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
