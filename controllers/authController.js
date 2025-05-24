const path = require('path');
const User = require('../models/User.js');
const { getDb } = require('../db');
const bcrypt = require('bcrypt');
const authController = {


    // Sending Register Page
    getRegisterPage: (req, res) => {
        res.sendFile(path.join(__dirname, "../views", "register.html"));
    },

    // Sending Login Page
    getLoginPage: (req, res) => {
        res.sendFile(path.join(__dirname, "../views", "login.html"));
    },

    // Registering User through mongodb by using email and finding it email already exist
    register: async (req, res) => {
        try {
            const user = new User();
            const saltRound=10;
            user.name = req.body.username;
            user.email = req.body.email;

            bcrypt.hash(req.body.password,saltRound,async function(err,hash){
                if(err){
                    console.log(err);
                }
                user.password=hash;
            })
           
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) return res.status(400).send("Email already exist");

            const db = getDb();
            const result = await db.collection("users").insertOne(user);
            res.redirect("/login");
        } catch (err) {
            console.error("Error registering user:", err);
            res.status(500).json({ error: "Could not register user" });
        }
    },

    // Login User by verifying email in db and then matching email with password 
    login: async (req, res) => {
        try {
            const { email: uEmail, password: uPass } = req.body; // User Enter

            const existingUser = await User.findOne({ email: uEmail }); // DB Email 
            
            bcrypt.compare(uPass,existingUser.password,function(err,result){
                if(err){
                    console.log(err);
                }
                if(result){
                    console.log("password matched");
                    req.session.userId = existingUser._id;
                    res.redirect("/tweets/profile");
                }
                else{
                    console.log("password not matched");
                }
            })
        } catch (err) {
            console.error("Error logging in:", err);
            res.status(500).json({ error: "Could not login user" });
        }
    }
};

module.exports = authController;