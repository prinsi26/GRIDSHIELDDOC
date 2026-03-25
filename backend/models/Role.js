const { Schema, model } = require('mongoose');

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  permissions: [String],
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = model('Role', RoleSchema);
