const mongoose = require("mongoose");

const vehiculeSchema = new mongoose.Schema({
  registration: { type: String, required: true },
  insuranceStartDate: { type: Date, required: true },
  insuranceEndDate: { type: Date, required: true },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2 },
    cin: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 5 },
    vehicules: [vehiculeSchema], 
  },
  // createdAt, updatedAt
  { timestamps: true }
);



const User = mongoose.model("User", userSchema);

module.exports = User;
