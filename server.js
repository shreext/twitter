const express = require('express');
const path = require('path');
const app = express();
const port = 2000;
const { connectToDB, getDb } = require('./db');
const { ObjectId } = require('mongodb');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));


let db;

// Connect to DB first, then start server
connectToDB((err) => {
    if (!err) {
        db = getDb();
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } else {
        console.error('Failed to connect to database:', err);
    }
});


async function getTweets() {
    return await db.collection('tweets').find().sort({ _id: -1 }).toArray();
}


app.get("/", async (req, res) => {
    try {
        if (!db) {
            throw new Error('Database not connected');
        }
        const tweets = await getTweets();
        res.render('index', { tweets });
    } catch (err) {
        console.error('Error fetching tweets:', err);
        res.status(500).send('Could not fetch tweets: ' + err.message);
    }
});


app.get("/post", (req, res) => {
    res.render(path.join(__dirname, '/views/post.ejs'));
})



app.post('/tweet_post', async (req, res) => {
    const user_tweet = req.body;
    console.log(user_tweet);

    try {
        if (!db) {
            throw new Error('Database not connected');
        }

        const tweets = await db.collection('tweets')
            .insertOne(user_tweet)
            .then(async resu => {
                const tweets = await getTweets();
                res.render('index', { tweets });
            })
            .catch(err => {
                res.status(500).json({ err: 'Coulc not create a document' })
            })
    } catch (err) {
        console.error('Error fetching tweets:', err);
        res.status(500).send('Could not fetch tweets: ' + err.message);
    }
})

app.post("/deleteTweet", (req, res) => {

    const user_ID = req.body.tweetId;
    console.log(user_ID);

    if(ObjectId.isValid(user_ID)){
        db.collection('tweets')
        .deleteOne({_id: new ObjectId(user_ID)})
        .then(async (result)=>{
            const tweets = await getTweets();
            res.render('index', { tweets });
        })
        .catch(err=>{
            res.status(500).json({error: "Could Not Delete"})
        })
    }else{
        res.status(500).json({error: "Not a valid doc id"})
    }
})