const mongoose = require('mongoose');
const User = require('./models/User');
const Role = require('./models/Role');
require('dotenv').config();

const PERMISSIONS = [
  'inquiry.view', 'inquiry.edit',
  'ticket.view', 'ticket.edit',
  'task.view', 'task.edit',
  'customer.view', 'customer.edit',
  'sales.view', 'sales.edit',
  'staff.view', 'staff.edit',
  'stock.view', 'stock.edit'
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Role.deleteMany({});
  console.log('Cleared existing data');

  // Seed roles
  await Role.insertMany([
    { name: 'Admin', permissions: ['*'], description: 'Full access to everything' },
    { name: 'Staff', permissions: ['inquiry.view','ticket.view','ticket.edit','task.view','task.edit','customer.view'], description: 'Standard staff access' },
    { name: 'Viewer', permissions: PERMISSIONS.filter(p => p.endsWith('.view')), description: 'Read-only access' }
  ]);
  console.log('✅ Roles seeded');

  // Create admin
  await User.create({
    firstName: 'Admin',
    lastName: 'User',
    username: 'admin',
    password: 'admin123',
    email: 'admin@gridshield.com',
    contact: '9999999999',
    role: 'Admin',
    permissions: PERMISSIONS
  });

  // Create sample staff
  await User.create([
    {
      firstName: 'Bhavesh', lastName: 'Shah',
      username: 'bhavesh', password: 'pass123',
      email: 'bhavesh@gridshield.com', contact: '9624891042',
      role: 'Staff',
      permissions: ['inquiry.view','ticket.view','ticket.edit','task.view','task.edit']
    },
    {
      firstName: 'Anjana', lastName: '',
      username: 'ANJANA', password: 'pass123',
      email: 'anjana@gridshield.com', contact: '9999999999',
      role: 'Staff',
      permissions: ['ticket.view','ticket.edit','customer.view']
    },
    {
      firstName: 'Darshit', lastName: 'Radadiya',
      username: 'darshit', password: 'pass123',
      email: 'darshit@gridshield.com', contact: '9978625089',
      role: 'Viewer',
      permissions: PERMISSIONS.filter(p => p.endsWith('.view'))
    }
  ]);

  console.log('✅ Sample users seeded');
  console.log('\n📋 Login credentials:');
  console.log('  Admin  → username: admin     | password: admin123');
  console.log('  Staff  → username: bhavesh   | password: pass123');
  console.log('  Viewer → username: darshit   | password: pass123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
