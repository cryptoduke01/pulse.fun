#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 Setting up PULSE.FUN database...\n');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Run migrations
  console.log('\n🗄️ Running database migrations...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  
  // Seed database with sample data
  console.log('\n🌱 Seeding database with sample data...');
  execSync('npx prisma db seed', { stdio: 'inherit' });
  
  console.log('\n✅ Database setup complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Update your .env.local with your database URL');
  console.log('2. Run: npm run dev');
  console.log('3. Visit: http://localhost:3000');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔧 Manual setup:');
  console.log('1. Set up a PostgreSQL database');
  console.log('2. Update DATABASE_URL in .env.local');
  console.log('3. Run: npx prisma migrate dev');
  console.log('4. Run: npx prisma generate');
}
