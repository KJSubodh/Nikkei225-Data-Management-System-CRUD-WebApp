require("dotenv").config({ path: "secret.env" });
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");

const router = express.Router();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
});

// Session Configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
};

// Configure Passport with Google OAuth2
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            const googleId = profile.id;
            const email = profile.emails[0].value;
            const name = profile.displayName;

            db.query("SELECT * FROM users WHERE google_id = ?", [googleId], (err, results) => {
                if (err) return done(err);
                if (results.length === 0) {
                    db.query(
                        "INSERT INTO users (google_id, email, name) VALUES (?, ?, ?)",
                        [googleId, email, name],
                        (err, result) => {
                            if (err) return done(err);
                            return done(null, { id: result.insertId, googleId, email, name });
                        }
                    );
                } else {
                    return done(null, results[0]);
                }
            });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
        if (err) return done(err);
        return done(null, results[0]);
    });
});

// OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        const redirectUrl = req.session.returnTo || "/";
        delete req.session.returnTo; // Remove the stored return path
        res.redirect(redirectUrl);
    }
);

// Logout Route
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) console.error(err);
        res.redirect("/");
    });
});

// Check Auth Status
router.get("/check-auth", (req, res) => {
    res.json({ authenticated: req.isAuthenticated() });
});

module.exports = { router, sessionConfig };
