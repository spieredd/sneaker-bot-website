if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

const express = require('express');
const ejs = require('ejs');
const chalk = require('chalk');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');
initializePassport(
    passport,
    email => {
        return users.find(user => user.email === email)
    },
    id => users.find(user => user.id === id)
);

const users = [];

const app = express();

const PORT = process.env.PORT || 3000;

app.set('vie-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.render('index.ejs', {
        name: 'Adrien'
    });
});

app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.get('/register', (req, res) => {
    res.render('register.ejs');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.redirect('/login');
    } catch {
        res.redirect('/register');
    };
    console.log(users);
});

app.listen(PORT, () => {
    console.log(chalk.bold.blue(`Server listening on port ${PORT}...`));
});