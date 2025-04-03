const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    org_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
});

const organizationModel = mongoose.model('Organization', organizationSchema);

module.exports = organizationModel;