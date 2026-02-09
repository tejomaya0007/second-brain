import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    content: { type: String, required: true },
    url: { type: String, trim: true, default: "" },
    tags: { type: [String], default: [] },
    aiTags: { type: [String], default: [] },
    summary: { type: String, default: "" },
  },
  { timestamps: true }
);

knowledgeSchema.index({ title: "text", content: "text", tags: 1 });

const Knowledge = mongoose.model("Knowledge", knowledgeSchema);
export default Knowledge;
