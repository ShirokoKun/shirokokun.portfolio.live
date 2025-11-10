// Helper script to format private key for Vercel
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'portfolio-backend', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

// Extract the private key
const keyMatch = envContent.match(/GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="([\s\S]*?)"/);

if (!keyMatch) {
  console.error('❌ Could not find private key in .env file');
  process.exit(1);
}

const privateKey = keyMatch[1];

console.log('📋 Instructions for adding private key to Vercel:\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('1️⃣  Go to Vercel Dashboard → Your Project → Settings → Environment Variables\n');

console.log('2️⃣  Add a new variable:');
console.log('   Name: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY\n');

console.log('3️⃣  Copy and paste this EXACT value (including newlines):\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(privateKey);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('⚠️  IMPORTANT:');
console.log('   - Do NOT add quotes around it in Vercel');
console.log('   - Paste it exactly as shown above');
console.log('   - Make sure all newlines are preserved\n');

console.log('4️⃣  Save and redeploy your project on Vercel\n');
