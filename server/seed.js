const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Company = require('./models/Company');
const Product = require('./models/Product');
const Review = require('./models/Review');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});

    // Hash password for all users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create Admin
    console.log('👤 Creating admin account...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@jagechas.com',
      password: hashedPassword,
      role: 'admin',
      points: 0
    });

    // Create Companies
    console.log('🏢 Creating companies...');
    const hul = await Company.create({
      name: 'Hindustan Unilever Limited (HUL)',
      industry: 'FMCG',
      description: 'Leading FMCG company in India',
      logo: '🧴'
    });

    const dabur = await Company.create({
      name: 'Dabur India',
      industry: 'Healthcare & FMCG',
      description: 'Ayurvedic and natural products',
      logo: '🌿'
    });

    const itc = await Company.create({
      name: 'ITC Limited',
      industry: 'Diversified',
      description: 'Diversified conglomerate',
      logo: '🏭'
    });

    // Create Company Users
    console.log('👥 Creating company accounts...');
    const hulUser = await User.create({
      name: 'HUL Manager',
      email: 'company@hul.com',
      password: hashedPassword,
      role: 'company',
      companyId: hul._id,
      points: 0
    });

    const daburUser = await User.create({
      name: 'Dabur Manager',
      email: 'company@dabur.com',
      password: hashedPassword,
      role: 'company',
      companyId: dabur._id,
      points: 0
    });

    const itcUser = await User.create({
      name: 'ITC Manager',
      email: 'company@itc.com',
      password: hashedPassword,
      role: 'company',
      companyId: itc._id,
      points: 0
    });

    // Create Products for HUL
    console.log('📦 Creating products...');
    const dove = await Product.create({
      name: 'Dove Soap',
      companyId: hul._id,
      category: 'Personal Care',
      description: 'Moisturizing beauty bar',
      image: '🧼'
    });

    const lux = await Product.create({
      name: 'Lux Soap',
      companyId: hul._id,
      category: 'Personal Care',
      description: 'Luxurious bathing experience',
      image: '🛁'
    });

    const surf = await Product.create({
      name: 'Surf Excel',
      companyId: hul._id,
      category: 'Laundry',
      description: 'Removes tough stains',
      image: '🧺'
    });

    // Create Products for Dabur
    const chyawanprash = await Product.create({
      name: 'Dabur Chyawanprash',
      companyId: dabur._id,
      category: 'Health Supplement',
      description: 'Immunity booster',
      image: '🥄'
    });

    const honitus = await Product.create({
      name: 'Dabur Honitus',
      companyId: dabur._id,
      category: 'Healthcare',
      description: 'Cough syrup',
      image: '💊'
    });

    const amla = await Product.create({
      name: 'Dabur Amla Hair Oil',
      companyId: dabur._id,
      category: 'Hair Care',
      description: 'Nourishing hair oil',
      image: '🧴'
    });

    // Create Products for ITC
    const aashirvaad = await Product.create({
      name: 'Aashirvaad Atta',
      companyId: itc._id,
      category: 'Food',
      description: 'Whole wheat flour',
      image: '🌾'
    });

    const sunfeast = await Product.create({
      name: 'Sunfeast Biscuits',
      companyId: itc._id,
      category: 'Food',
      description: 'Delicious biscuits',
      image: '🍪'
    });

    const bingo = await Product.create({
      name: 'Bingo Chips',
      companyId: itc._id,
      category: 'Snacks',
      description: 'Crispy potato chips',
      image: '🥔'
    });

    // Create Test Users
    console.log('👨‍👩‍👧‍👦 Creating test users...');
    const user1 = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: hashedPassword,
      role: 'user',
      points: 30
    });

    const user2 = await User.create({
      name: 'Priya Singh',
      email: 'priya@example.com',
      password: hashedPassword,
      role: 'user',
      points: 20
    });

    const user3 = await User.create({
      name: 'Amit Kumar',
      email: 'amit@example.com',
      password: hashedPassword,
      role: 'user',
      points: 10
    });

    // Create Sample Reviews
    console.log('⭐ Creating sample reviews...');
    await Review.create([
      {
        userId: user1._id,
        productId: dove._id,
        liked: 'Great moisturizing effect, gentle on skin, pleasant fragrance',
        disliked: 'Price could be lower, packaging not eco-friendly',
        rating: 8,
        comment: 'Overall excellent product for daily use'
      },
      {
        userId: user1._id,
        productId: surf._id,
        liked: 'Removes tough stains easily, good fragrance, long lasting',
        disliked: 'Expensive compared to other brands',
        rating: 9,
        comment: 'Best detergent for white clothes'
      },
      {
        userId: user1._id,
        productId: chyawanprash._id,
        liked: 'Boosts immunity, natural ingredients, tasty',
        disliked: 'Sticky texture, high sugar content',
        rating: 7,
        comment: 'Good for winter season'
      },
      {
        userId: user2._id,
        productId: dove._id,
        liked: 'Soft on skin, moisturizing, dermatologically tested',
        disliked: 'Melts quickly in humidity',
        rating: 8,
        comment: 'My family loves it'
      },
      {
        userId: user2._id,
        productId: aashirvaad._id,
        liked: 'Fresh quality, makes soft rotis, good packaging',
        disliked: 'Sometimes contains impurities',
        rating: 7,
        comment: 'Reliable brand for daily use'
      },
      {
        userId: user3._id,
        productId: bingo._id,
        liked: 'Crispy texture, various flavors, affordable',
        disliked: 'High in salt and oil, not healthy',
        rating: 6,
        comment: 'Good for occasional snacking'
      },
      {
        userId: user3._id,
        productId: amla._id,
        liked: 'Reduces hair fall, natural ingredients, pleasant smell',
        disliked: 'Greasy feel, takes time to show results',
        rating: 8,
        comment: 'Noticed improvement after regular use'
      },
      {
        userId: user1._id,
        productId: sunfeast._id,
        liked: 'Tasty, crispy, good value for money',
        disliked: 'Contains palm oil, high in sugar',
        rating: 7,
        comment: 'Kids favorite snack'
      },
      {
        userId: user2._id,
        productId: lux._id,
        liked: 'Luxurious fragrance, smooth lather, affordable',
        disliked: 'Dries out skin sometimes',
        rating: 7,
        comment: 'Good budget option'
      },
      {
        userId: user3._id,
        productId: honitus._id,
        liked: 'Effective for cough, honey based, no side effects',
        disliked: 'Very sweet, expensive',
        rating: 8,
        comment: 'Works well for dry cough'
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@jagechas.com');
    console.log('  Password: password123');
    console.log('\nCompany Accounts:');
    console.log('  HUL: company@hul.com / password123');
    console.log('  Dabur: company@dabur.com / password123');
    console.log('  ITC: company@itc.com / password123');
    console.log('\nTest Users:');
    console.log('  rahul@example.com / password123');
    console.log('  priya@example.com / password123');
    console.log('  amit@example.com / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
