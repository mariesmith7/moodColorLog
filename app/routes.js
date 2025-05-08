const { ObjectId } = require('mongodb');

module.exports = function(app, passport, db) {

    // Normal Routes

    // show login page (home page)
    app.get('/', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // display signup
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // show mood on Dashboard (Main App Page)
    app.get('/index', isLoggedIn, function(req, res) {
        db.collection('moods').find({ userId: req.user._id }).toArray((err, result) => {
            if (err) return console.log(err);
            res.render('index.ejs', {
                user: req.user,
                moods: result
            });
        });
    });

    // Logout
    app.get('/logout', function(req, res) {
        req.logout(function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });

    // Mood actions

    // adding a mood
    app.post('/addMood', isLoggedIn, (req, res) => {
        db.collection('moods').insertOne({
            mood: req.body.mood,
            color: req.body.color,
            userId: req.user._id,
            createdAt: new Date()
        }, (err, result) => {
            if (err) return console.log(err);
            console.log('Saved new mood to database');
            res.redirect('/index');
        });
    });

    // Delete a mood
    app.post('/deleteMood', isLoggedIn, (req, res) => {
        const id = req.body.id;
        db.collection('moods').deleteOne(
            { _id: new ObjectId(id), userId: req.user._id },
            (err, result) => {
                if (err) return res.status(500).send(err);
                res.redirect('/index');
            }
        );
    });

    // auth routes

    // Login form processing
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/index',
        failureRedirect: '/',
        failureFlash: true
    }));

    // signup form processing
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/index',
        failureRedirect: '/signup',
        failureFlash: true
    }));

};

// mw to check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}