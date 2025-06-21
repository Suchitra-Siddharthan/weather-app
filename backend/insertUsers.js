const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/weather-trip-planner', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Function to create users with hashed passwords
const createUsers = async () => {
    try {
        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        // Create sample users with hashed passwords
        const users = [
            {
                name: "John Doe",
                email: "john@example.com",
                password: "pwd123",
                role: "user"
            },
            {
                name: "Jane Smith",
                email: "jane@example.com",
                password: "pwd123",
                role: "user"
            },
            {
                name: "Admin User",
                email: "admin@example.com",
                password: "pwd123",
                role: "admin"
            }
        ];

        // Hash passwords and create users
        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        await User.insertMany(users);
        console.log('Users created successfully');
        
        // Exit the process
        process.exit(0);
    } catch (err) {
        console.error('Error creating users:', err);
        process.exit(1);
    }
};

// Run the function
createUsers(); 