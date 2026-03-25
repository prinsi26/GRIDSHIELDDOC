const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  firstName:   { type: String, required: true, trim: true },
  lastName:    { type: String, trim: true, default: '' },
  email:       { type: String, trim: true, lowercase: true, default: '' },
  contact:     { type: String, default: '' },
  address:     { type: String, default: '' },
  username:    { type: String, required: true, unique: true, trim: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['Admin', 'Staff', 'Viewer'], default: 'Staff' },
  permissions: {
    type: [String],
    default: []
    // Examples: 'inquiry.view', 'inquiry.edit', 'ticket.view', 'ticket.edit',
    //           'task.view', 'task.edit', 'customer.view', 'customer.edit',
    //           'sales.view', 'sales.edit', 'staff.view', 'staff.edit',
    //           'stock.view', 'stock.edit'
  },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

// Compare password helper
UserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = model('User', UserSchema);
