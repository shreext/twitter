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
            user.name = req.body.username;
            user.email = req.body.email;
            user.password = req.body.password;
           
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
            const { email: uEmail, password: uPass } = req.body;
        
            const existingUser = await User.findOne({ email: uEmail });
        
            // Check if user exists
            if (!existingUser) {
                console.log("User not found");
                return res.status(400).send("Invalid email or password");
            }
        
            // Check if password same
            if (uPass == existingUser.password) {
                console.log("Password matched ", uPass, " ", existingUser.password);
                req.session.userId = existingUser._id;
                return res.redirect("/tweets/profile");
               
            }else{
                console.log("Password not matched");
                return res.status(400).send("Invalid email or password");
            }
        
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send("Something went wrong");
        }
        
    }
};

module.exports = authController;