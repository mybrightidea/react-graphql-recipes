const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RecipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  email: {
    type: String
  }
});
RecipeSchema.index({
  "$**": "text"
});
module.exports = mongoose.model("Recipe", RecipeSchema);
