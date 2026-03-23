import mongoose from "mongoose";

const uri = "mongodb+srv://maajidhassan2006_db_user:ellOaUHKhRfBM3Fh@cluster0.ydq95zc.mongodb.net/?appName=Cluster0";

const electionSchema = new mongoose.Schema({
  title: String,
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }]
}, { strict: false });

const candidateSchema = new mongoose.Schema({}, { strict: false });
const voteSchema = new mongoose.Schema({}, { strict: false });

const Election = mongoose.model("Election", electionSchema);
const Candidate = mongoose.model("Candidate", candidateSchema);
const Vote = mongoose.model("Vote", voteSchema);

mongoose.connect(uri)
  .then(async () => {
    console.log("Connected to MongoDB");
    
    // Find election
    const elections = await Election.find({ title: /new election v4/i });
    if (elections.length === 0) {
      console.log("No election found with that name.");
      process.exit(0);
    }
    
    const electionIds = elections.map(e => e._id);
    let candidateIds = [];
    elections.forEach(e => {
      if (e.candidates) {
        candidateIds = candidateIds.concat(e.candidates);
      }
    });

    // Delete elections
    const deleteElec = await Election.deleteMany({ _id: { $in: electionIds } });
    console.log(`Deleted ${deleteElec.deletedCount} elections.`);
    
    // Delete candidates
    if (candidateIds.length > 0) {
      const deleteCand = await Candidate.deleteMany({ _id: { $in: candidateIds } });
      console.log(`Deleted ${deleteCand.deletedCount} candidates.`);
    }

    // Delete votes
    const deleteVotes = await Vote.deleteMany({ election: { $in: electionIds } });
    console.log(`Deleted ${deleteVotes.deletedCount} votes.`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection failed:", err.message);
    process.exit(1);
  });
