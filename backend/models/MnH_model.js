const mongoose = require('mongoose');

const MnHWasteSchema = new mongoose.Schema({
    type: { type: String, required: true },
    location: { type: String, required: true },
    quantity: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
});

const MnHWaste = mongoose.model('MnHWaste', MnHWasteSchema);
module.exports = MnHWaste;
