const mongoose = require('mongoose');

const importSessionSchema = new mongoose.Schema({
  sessionId: String,
  fileName: String,
  importDate: {
    type: Date,
    default: Date.now
  },
  recordsProcessed: Number,
  recordsSuccess: Number,
  recordsFailed: Number,
  mappingsUsed: Object,
  conflicts: Array,
  errors: Array
}, {
  timestamps: true
});

module.exports = mongoose.model('ImportSession', importSessionSchema);
