const mongoose = require('mongoose');

const WeatherSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    humidity: {
        type: Number,
        required: true
    },
    windSpeed: {
        type: Number,
        required: true
    }
});

const ActivitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    weatherCondition: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

const TripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    weatherForecast: [WeatherSchema],
    activities: [ActivitySchema],
    packingList: [{
        item: String,
        category: String,
        required: Boolean
    }],
    notes: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trip', TripSchema); 