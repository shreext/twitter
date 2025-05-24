const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
require("dotenv").config();

let dbConnection;

const uri = 'mongodb+srv://AnantShree_Twitter:Shree%40%239110@cluster0.eqyuh72.mongodb.net/twitter?retryWrites=true&w=majority';

// Improved connection setup
module.exports = {
    connectToDB: async (cb) => {
        try {
            // Connect using MongoClient
            const client = await MongoClient.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 30000
            });
            dbConnection = client.db();
            
            // Connect using Mongoose (only if you need both)
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 30000
            });
            
            console.log('Successfully connected to MongoDB');
            return cb();
        } catch (err) {
            console.error('Database connection error:', err);
            return cb(err);
        }
    },
    getDb: () => {
        if (!dbConnection) {
            throw new Error('Database not initialized');
        }
        return dbConnection;
    }
};