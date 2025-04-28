const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 2000; // Use environment variable for port
const { connectToDB, getDb } = require('./db');
const { ObjectId } = require('mongodb');

// Configuration
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let db;

// Connect to DB first, then start server
connectToDB((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
        process.exit(1); // Exit if DB connection fails
    }
    
    db = getDb();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

// Helper function with better error handling
async function getTweets() {
    try {
        return await db.collection('tweets').find().sort({ _id: -1 }).toArray();
    } catch (err) {
        console.error('Error fetching tweets:', err);
        throw err; // Re-throw to be handled by route
    }
}

// Routes
app.get("/", async (req, res) => {
    try {
        const tweets = await getTweets();
        res.render('index', { tweets });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).render('error', { message: 'Could not fetch tweets' });
    }
});

app.get("/post", (req, res) => {
    res.render('post');
});

app.post('/tweet_post', async (req, res) => {
    const user_tweet = req.body;
    
    try {
        const result = await db.collection('tweets').insertOne(user_tweet);
        const tweets = await getTweets();
        res.render('index', { tweets });
    } catch (err) {
        console.error('Error posting tweet:', err);
        res.status(500).render('error', { message: 'Could not post tweet' });
    }
});

app.post("/deleteTweet", async (req, res) => {
    const user_ID = req.body.tweetId;
    
    if (!ObjectId.isValid(user_ID)) {
        return res.status(400).json({ error: "Not a valid document ID" });
    }

    try {
        await db.collection('tweets').deleteOne({ _id: new ObjectId(user_ID) });
        const tweets = await getTweets();
        res.render('index', { tweets });
    } catch (err) {
        console.error('Error deleting tweet:', err);
        res.status(500).json({ error: "Could not delete tweet" });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { message: 'Something went wrong!' });
});