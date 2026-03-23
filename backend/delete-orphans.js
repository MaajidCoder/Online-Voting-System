import mongoose from "mongoose";

const uri = "mongodb+srv://maajidhassan2006_db_user:ellOaUHKhRfBM3Fh@cluster0.ydq95zc.mongodb.net/?appName=Cluster0";

const candidateSchema = new mongoose.Schema({}, { strict: false });
const voteSchema = new mongoose.Schema({}, { strict: false });

const Candidate = mongoose.model("Candidate", candidateSchema);
const Vote = mongoose.model("Vote", voteSchema);

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Delete candidates
    const candidateIds = [
      "69c16f70bdd23bbe71c42647",
      "69c17072bdd23bbe71c4266f",
      "69c170bdbdd23bbe71c4268c",
      "69c17c61bdd23bbe71c42908"
    ];
    const candResult = await Candidate.deleteMany({ _id: { $in: candidateIds } });
    console.log(`Deleted ${candResult.deletedCount} candidates.`);
    
    // Delete votes associated with the deleted elections
    const electionIds = [
      "69c16f4abdd23bbe71c4263b",
      "69c17bd4bdd23bbe71c428dd"
    ];
    const voteResult = await Vote.deleteMany({ election: { $in: electionIds } });
    console.log(`Deleted ${voteResult.deletedCount} votes.`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
