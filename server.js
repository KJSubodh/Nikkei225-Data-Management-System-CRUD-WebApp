require("dotenv").config({ path: "secret.env" });
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { router: authRoutes, sessionConfig } = require("./auth");

const app = express();
app.use(express.json());
const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: ["http://localhost:3000", "https://accounts.google.com"], // Allow frontend + Google
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use("/auth", authRoutes);

app.get("/auth", (req, res) => {
    res.redirect("/auth/google");
});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// Check Authentication Endpoint
app.get('/api/check-auth', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: { name: req.user.name, email: req.user.email } });
    } else {
        res.json({ authenticated: false });
    }
});

// Middleware to ensure authentication
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.returnTo = req.originalUrl; 
    res.redirect('/auth/google'); 
}

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get("/", ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect('/');
    });
});

/* ------------------------------
   MAIN TABLE CRUD ENDPOINTS
------------------------------ */

// GET all Main rows
app.get('/api/main', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Main', (err, result) => {
        if (err) {
            console.error('Error querying Main table:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

// POST new Main row
app.post('/api/main', ensureAuthenticated, (req, res) => {
    const { UserName, Date, Divisor, Dividend, RepoRate, FundingRate, FYR, DateFormat } = req.body;
    if (!UserName || !Date || !Divisor || !Dividend || !RepoRate || !FundingRate || !FYR || !DateFormat) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'INSERT INTO Main (UserName, Date, Divisor, Dividend, RepoRate, FundingRate, FYR, DateFormat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [UserName, Date, Divisor, Dividend, RepoRate, FundingRate, FYR, DateFormat],
        (err, result) => {
            if (err) {
                console.error('Error inserting data into Main table:', err);
                return res.status(500).send('Error saving data');
            }
            res.json({ success: true, id: result.insertId });
        }
    );
});

// PUT update Main row
app.put('/api/main/:id', ensureAuthenticated, (req, res) => {
    const { UserName, Date, Divisor, Dividend, RepoRate, FundingRate, FYR, DateFormat } = req.body;
    const id = req.params.id;
    if (!UserName || !Date || !Divisor || !Dividend || !RepoRate || !FundingRate || !FYR || !DateFormat) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'UPDATE Main SET UserName=?, Date=?, Divisor=?, Dividend=?, RepoRate=?, FundingRate=?, FYR=?, DateFormat=? WHERE id=?',
        [UserName, Date, Divisor, Dividend, RepoRate, FundingRate, FYR, DateFormat, id],
        (err, result) => {
            if (err) {
                console.error('Error updating Main table:', err);
                return res.status(500).send('Error updating data');
            }
            res.json({ success: true });
        }
    );
});

// DELETE Main row
app.delete('/api/main/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Main WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting from Main table:', err);
            return res.status(500).send('Error deleting data');
        }
        res.json({ success: true });
    });
});

/* ------------------------------
   DIVISOR TABLE CRUD ENDPOINTS
------------------------------ */
// GET all Divisor rows
app.get('/api/divisor', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Nikki225Divisor', (err, result) => {
        if (err) {
            console.error('Error querying Divisor table:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

// POST new Divisor row
app.post('/api/divisor', ensureAuthenticated, (req, res) => {
    const { Index, FromDt, ToDt, Divisor, UpdateSource, UpdateTime } = req.body;
    if (!Index || !FromDt || !ToDt || !Divisor || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'INSERT INTO Nikki225Divisor (`Index`, FromDt, ToDt, Divisor, UpdateSource, UpdateTime) VALUES (?, ?, ?, ?, ?, ?)', 
        [Index, FromDt, ToDt, Divisor, UpdateSource, UpdateTime],
        (err, result) => {
            if (err) {
                console.error('Error inserting data into Divisor table:', err);
                return res.status(500).send('Error saving data');
            }
            res.json({ success: true, id: result.insertId });
        }
    );
});

// PUT update Divisor row
app.put('/api/divisor/:id', ensureAuthenticated, (req, res) => {
    const { Index, FromDt, ToDt, Divisor, UpdateSource, UpdateTime } = req.body;
    const id = req.params.id;
    if (!Index || !FromDt || !ToDt || !Divisor || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'UPDATE Nikki225Divisor SET `Index`=?, FromDt=?, ToDt=?, Divisor=?, UpdateSource=?, UpdateTime=? WHERE id=?',
        [Index, FromDt, ToDt, Divisor, UpdateSource, UpdateTime, id],
        (err, result) => {
            if (err) {
                console.error('Error updating Divisor table:', err);
                return res.status(500).send('Error updating data');
            }
            res.json({ success: true });
        }
    );
});

// DELETE Divisor row
app.delete('/api/divisor/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Nikki225Divisor WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting from Divisor table:', err);
            return res.status(500).send('Error deleting data');
        }
        res.json({ success: true });
    });
});

/* ------------------------------
   DIVIDEND TABLE CRUD ENDPOINTS
------------------------------ */
// GET all Dividend rows
app.get('/api/dividend', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Nikki225Dividend', (err, result) => {
        if (err) {
            console.error('Error querying Dividend table:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

// POST new Dividend row
app.post('/api/dividend', ensureAuthenticated, (req, res) => {
    const { Dt, Index, DivDt, Dividend, UpdateSource, UpdateTime } = req.body;
    if (!Dt || !Index || !DivDt || !Dividend || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'INSERT INTO Nikki225Dividend (Dt, `Index`, DivDt, Dividend, UpdateSource, UpdateTime) VALUES (?, ?, ?, ?, ?, ?)', 
        [Dt, Index, DivDt, Dividend, UpdateSource, UpdateTime],
        (err, result) => {
            if (err) {
                console.error('Error inserting data into Dividend table:', err);
                return res.status(500).send('Error saving data');
            }
            res.json({ success: true, id: result.insertId });
        }
    );
});

// PUT update Dividend row
app.put('/api/dividend/:id', ensureAuthenticated, (req, res) => {
    const { Dt, Index, DivDt, Dividend, UpdateSource, UpdateTime } = req.body;
    const id = req.params.id;
    if (!Dt || !Index || !DivDt || !Dividend || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'UPDATE Nikki225Dividend SET Dt=?, `Index`=?, DivDt=?, Dividend=?, UpdateSource=?, UpdateTime=? WHERE id=?',
        [Dt, Index, DivDt, Dividend, UpdateSource, UpdateTime, id],
        (err, result) => {
            if (err) {
                console.error('Error updating Dividend table:', err);
                return res.status(500).send('Error updating data');
            }
            res.json({ success: true });
        }
    );
});

// DELETE Dividend row
app.delete('/api/dividend/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Nikki225Dividend WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting from Dividend table:', err);
            return res.status(500).send('Error deleting data');
        }
        res.json({ success: true });
    });
});

/* ------------------------------
   REPO RATE TABLE CRUD ENDPOINTS
------------------------------ */
// GET all Repo Rate rows
app.get('/api/repo_rate', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Nikki225RepoRate', (err, result) => {
        if (err) {
            console.error('Error querying Repo Rate table:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

// POST new Repo Rate row
app.post('/api/repo_rate', ensureAuthenticated, (req, res) => {
    const { Dt, Index, Term, Bid, Offer, UpdateSource, UpdateTime } = req.body;
    if (!Dt || !Index || !Term || !Bid || !Offer || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    const bidDecimal = parseFloat(Bid);
    const offerDecimal = parseFloat(Offer);
    if (isNaN(bidDecimal) || isNaN(offerDecimal)) {
        return res.status(400).send('Bid and Offer must be valid decimal numbers');
    }
    db.query(
        'INSERT INTO Nikki225RepoRate (Dt, `Index`, Term, Bid, Offer, UpdateSource, UpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [Dt, Index, Term, bidDecimal, offerDecimal, UpdateSource, UpdateTime],
        (err, result) => {
            if (err) {
                console.error('Error inserting data into Repo Rate table:', err);
                return res.status(500).send('Error saving data');
            }
            res.json({ success: true, id: result.insertId });
        }
    );
});

// PUT update Repo Rate row
app.put('/api/repo_rate/:id', ensureAuthenticated, (req, res) => {
    const { Dt, Index, Term, Bid, Offer, UpdateSource, UpdateTime } = req.body;
    const id = req.params.id;
    if (!Dt || !Index || !Term || !Bid || !Offer || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    const bidDecimal = parseFloat(Bid);
    const offerDecimal = parseFloat(Offer);
    if (isNaN(bidDecimal) || isNaN(offerDecimal)) {
        return res.status(400).send('Bid and Offer must be valid decimal numbers');
    }
    db.query(
        'UPDATE Nikki225RepoRate SET Dt=?, `Index`=?, Term=?, Bid=?, Offer=?, UpdateSource=?, UpdateTime=? WHERE id=?',
        [Dt, Index, Term, bidDecimal, offerDecimal, UpdateSource, UpdateTime, id],
        (err, result) => {
            if (err) {
                console.error('Error updating Repo Rate table:', err);
                return res.status(500).send('Error updating data');
            }
            res.json({ success: true });
        }
    );
});

// DELETE Repo Rate row
app.delete('/api/repo_rate/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Nikki225RepoRate WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting from Repo Rate table:', err);
            return res.status(500).send('Error deleting data');
        }
        res.json({ success: true });
    });
});

/* ------------------------------
   FUNDING RATE TABLE CRUD ENDPOINTS
------------------------------ */
// GET all Funding Rate rows
app.get('/api/funding_rate', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM Nikki225FundingRate', (err, result) => {
        if (err) {
            console.error('Error querying Funding Rate table:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

// POST new Funding Rate row
app.post('/api/funding_rate', ensureAuthenticated, (req, res) => {
    const { Dt, Index, Term, Bid, Offer, UpdateSource, UpdateTime } = req.body;
    if (!Dt || !Index || !Term || !Bid || !Offer || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'INSERT INTO Nikki225FundingRate (Dt, `Index`, Term, Bid, Offer, UpdateSource, UpdateTime) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [Dt, Index, Term, Bid, Offer, UpdateSource, UpdateTime],
        (err, result) => {
            if (err) {
                console.error('Error inserting data into Funding Rate table:', err);
                return res.status(500).send('Error saving data');
            }
            res.json({ success: true, id: result.insertId });
        }
    );
});

// PUT update Funding Rate row
app.put('/api/funding_rate/:id', ensureAuthenticated, (req, res) => {
    const { Dt, Index, Term, Bid, Offer, UpdateSource, UpdateTime } = req.body;
    const id = req.params.id;
    if (!Dt || !Index || !Term || !Bid || !Offer || !UpdateSource || !UpdateTime) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'UPDATE Nikki225FundingRate SET Dt=?, `Index`=?, Term=?, Bid=?, Offer=?, UpdateSource=?, UpdateTime=? WHERE id=?',
        [Dt, Index, Term, Bid, Offer, UpdateSource, UpdateTime, id],
        (err, result) => {
            if (err) {
                console.error('Error updating Funding Rate table:', err);
                return res.status(500).send('Error updating data');
            }
            res.json({ success: true });
        }
    );
});

// DELETE Funding Rate row
app.delete('/api/funding_rate/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM Nikki225FundingRate WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting from Funding Rate table:', err);
            return res.status(500).send('Error deleting data');
        }
        res.json({ success: true });
    });
});

/* ------------------------------
   FUTURE PRICE TABLE CRUD ENDPOINTS
------------------------------ */
// GET all Future Price rows
app.get('/api/future_price', ensureAuthenticated, (req, res) => {
    db.query('SELECT * FROM FuturePrice', (err, result) => {
        if (err) {
            console.error('Error querying Future Price table:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

// POST new Future Price row
app.post('/api/future_price', ensureAuthenticated, (req, res) => {
    const { ParametersUse, CalculationDetails } = req.body;
    if (!ParametersUse || !CalculationDetails) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'INSERT INTO FuturePrice (ParametersUse, CalculationDetails) VALUES (?, ?)', 
        [ParametersUse, CalculationDetails],
        (err, result) => {
            if (err) {
                console.error('Error inserting data into Future Price table:', err);
                return res.status(500).send('Error saving data');
            }
            res.json({ success: true, id: result.insertId });
        }
    );
});

// PUT update Future Price row
app.put('/api/future_price/:id', ensureAuthenticated, (req, res) => {
    const { ParametersUse, CalculationDetails } = req.body;
    const id = req.params.id;
    if (!ParametersUse || !CalculationDetails) {
        return res.status(400).send('Missing required fields');
    }
    db.query(
        'UPDATE FuturePrice SET ParametersUse=?, CalculationDetails=? WHERE id=?',
        [ParametersUse, CalculationDetails, id],
        (err, result) => {
            if (err) {
                console.error('Error updating Future Price table:', err);
                return res.status(500).send('Error updating data');
            }
            res.json({ success: true });
        }
    );
});

// DELETE Future Price row
app.delete('/api/future_price/:id', ensureAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM FuturePrice WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting from Future Price table:', err);
            return res.status(500).send('Error deleting data');
        }
        res.json({ success: true });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
