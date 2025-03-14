// models/Constat.js
const mongoose = require("mongoose");
const { parseDate } = require("../middleware/dateUtils");

const constatSchema = new mongoose.Schema({
  // Champs de la partie 1 (General_Info)
  date: { type: Date, required: true, set: (value) => parseDate(value) },
  time: { type: String, required: true },
  location: { type: String, required: true },
  injuries: { type: Boolean, required: true },
  otherDamages: { type: Boolean, required: true },
  witnesses: { type: Boolean },

  // Champs de la partie 2 (VehiculeA)
  insuredVehicle: { type: String, required: true },
  contractNumber: { type: String, required: true },
  agency: { type: String, required: true },
  validFrom: { type: Date, required: true, set: (value) => parseDate(value) },
  validTo: { type: Date, required: true, set: (value) => parseDate(value) },
  driverLastName: { type: String, required: true },
  driverFirstName: { type: String, required: true },
  driverAddress: { type: String, required: true },
  driverLicenseNumber: { type: String, required: true },
  licenseIssueDate: {
    type: Date,
    required: true,
    set: (value) => parseDate(value),
  },
  insuredLastName: { type: String, required: true },
  insuredFirstName: { type: String, required: true },
  insuredAddress: { type: String, required: true },
  insuredPhone: { type: String, required: true },
  vehicleBrand: { type: String, required: true },
  vehicleRegistration: { type: String, required: true },
  direction: { type: String, required: true },
  comingFrom: { type: String, required: true },
  goingTo: { type: String, required: true },
  damageDescription: { type: String, required: true },
  circumstances: { type: Object, required: true },
  numberOfCheckedBoxes: { type: Number, required: true },
  voiceRecordings: { type: Array, default: [] },
});

const Constat = mongoose.model("Constat", constatSchema);

module.exports = Constat;

/*frontImage: { type: String },
backImage: { type: String },
leftImage: { type: String },
rightImage: { type: String },*/
