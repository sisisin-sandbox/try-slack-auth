const { CLIENT_ID, CLIENT_SECRET, PORT } = process.env,
  SlackStrategy = require('@aoberoi/passport-slack').default.Strategy,
  passport = require('passport'),
  express = require('express'),
  app = express();

passport.use(
  new SlackStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    },
    (accessToken, scopes, team, bot, user, done) => {
      return done(null, { accessToken, scopes, team, bot, user });
    },
  ),
);
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.use(passport.initialize());
app.use(express.static('public'));
app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index.html'));
app.get('/auth/slack', passport.authenticate('slack'));
app.get(
  '/auth/slack/callback',
  passport.authenticate('slack', { failureRedirect: '/login' }),
  function(req, res) {
    console.log(req.user);
    res.redirect('/');
  },
);
app.listen(PORT || 3000);
