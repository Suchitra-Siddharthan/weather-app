// Connect to the database
db = db.getSiblingDB('weather-trip-planner');

// Insert sample users
db.users.insertMany([
  {
    name: "John Doe",
    email: "john@example.com",
    password: "pwd123",
    role: "user",
    createdAt: new Date()
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "pwd123",
    role: "user",
    createdAt: new Date()
  },
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "pwd123",
    role: "admin",
    createdAt: new Date()
  }
]);

// Get the first user's ID
const userId = db.users.findOne()._id;

// Insert sample trips
db.trips.insertMany([
  {
    user: userId,
    destination: "Paris",
    startDate: new Date("2024-05-01"),
    endDate: new Date("2024-05-07"),
    weatherForecast: [
      {
        date: new Date("2024-05-01"),
        temperature: 20,
        condition: "Sunny",
        humidity: 65,
        windSpeed: 10
      },
      {
        date: new Date("2024-05-02"),
        temperature: 22,
        condition: "Partly Cloudy",
        humidity: 70,
        windSpeed: 12
      }
    ],
    activities: [
      {
        name: "Eiffel Tower Visit",
        description: "Visit the iconic Eiffel Tower",
        weatherCondition: "Sunny",
        time: "Morning"
      },
      {
        name: "Louvre Museum",
        description: "Explore the famous art museum",
        weatherCondition: "Partly Cloudy",
        time: "Afternoon"
      }
    ],
    packingList: [
      {
        item: "Sunglasses",
        category: "Accessories",
        required: true
      },
      {
        item: "Umbrella",
        category: "Rain Gear",
        required: false
      }
    ],
    notes: "First trip to Paris, very excited!",
    createdAt: new Date()
  },
  {
    user: userId,
    destination: "Tokyo",
    startDate: new Date("2024-06-15"),
    endDate: new Date("2024-06-22"),
    weatherForecast: [
      {
        date: new Date("2024-06-15"),
        temperature: 25,
        condition: "Rainy",
        humidity: 80,
        windSpeed: 15
      },
      {
        date: new Date("2024-06-16"),
        temperature: 27,
        condition: "Cloudy",
        humidity: 75,
        windSpeed: 12
      }
    ],
    activities: [
      {
        name: "Shibuya Crossing",
        description: "Experience the famous crossing",
        weatherCondition: "Cloudy",
        time: "Evening"
      },
      {
        name: "Senso-ji Temple",
        description: "Visit the ancient temple",
        weatherCondition: "Rainy",
        time: "Morning"
      }
    ],
    packingList: [
      {
        item: "Raincoat",
        category: "Rain Gear",
        required: true
      },
      {
        item: "Comfortable Shoes",
        category: "Footwear",
        required: true
      }
    ],
    notes: "First time in Japan, looking forward to the culture!",
    createdAt: new Date()
  }
]);
db.users.insertOne({
    name: "Admin User",
    email: "admin@weather.com",
    password: "$2a$10$8K1p/a0dL1LXMIgoEDFrwOgkZJ1MJ9K2j8OCxpXdH4yPcZBJc.47e",
    role: "admin",
    createdAt: new Date()
  })

// Print confirmation
print("Sample data inserted successfully!");