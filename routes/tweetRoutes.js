const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');

router.get('/profile', tweetController.getProfile);
router.get('/post', tweetController.getPostPage);
router.get('/home', tweetController.getHomePage);
router.post('/tweet_post', tweetController.createTweet);
router.post('/deleteTweet', tweetController.deleteTweet);

module.exports = router;