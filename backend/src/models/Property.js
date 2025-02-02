module.exports = {
    name: { type: String, required: true },
    address: { type: String, required: true },
    area: { type: Number, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};