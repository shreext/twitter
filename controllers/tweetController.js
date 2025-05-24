const Tweet = require("../models/Tweet.js");
const User = require("../models/User.js");

const { getDb } = require("../db");
const { ObjectId } = require("mongodb");

const tweetController = {

  // Taking all tweets from db 
  getTweets: async () => {
    try {
      const db = getDb();
      const tweets = await Tweet.find()
        .populate("author", "name") // getting all the data with refrence of author
        .sort({ createdAt: -1 });

      return tweets;
    } catch (err) {
      console.error("Error fetching tweets:", err);
      throw err;
    }
  },

  getPostPage: (req, res) => {
    res.render("post");
  },

  getHomePage: async (req, res) => {
    try {
      const tweets = await tweetController.getTweets();
      res.render("index", { tweets });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).render("error", { message: "Could not fetch tweets" });
    }
  },

  createTweet: async (req, res) => {
    try {
      // Check if user is logged inby checking session through express-session
      if (!req.session.userId) {
        return res.redirect("/login");
      }
      const user = await User.findById(req.session.userId);

      const user_tweet = new Tweet();
      user_tweet.content = req.body.userTweet;
      user_tweet.author = req.session.userId;  // Set the author
      user_tweet.createdAt = new Date();  // Add timestamp

      const db = getDb();
      await db.collection("tweets").insertOne(user_tweet);

      res.redirect("/profile");
    } catch (err) {
      console.error("Error posting tweet:", err);
      res.status(500).render("error", { message: "Could not post tweet" });
    }
  },

  deleteTweet: async (req, res) => {
    const user_ID = req.body.tweetId;

    if (!ObjectId.isValid(user_ID)) {
      return res.status(400).json({ error: "Not a valid document ID" });
    }

    try {
      const db = getDb();
      await db.collection("tweets").deleteOne({ _id: new ObjectId(user_ID) });
      res.redirect("/profile");
    } catch (err) {
      console.error("Error deleting tweet:", err);
      res.status(500).json({ error: "Could not delete tweet" });
    }
  },

  getProfile: async (req, res) => {
    if (!req.session.userId) {
      return res.redirect("/login");
    }
    const user = await User.findById(req.session.userId);
    // here author take the user id of the login user which store in session
    const userTweets = await Tweet.find({ author: user._id }).sort({
      createdAt: -1,
    });

    res.render("profile", {
      user,
      tweets: userTweets,
    });
  },
};

module.exports = tweetController;
