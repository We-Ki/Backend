const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/User");

//로컬 로그인 방식(사용자 명, 비밀번호 이용)
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, username, password, done) {
      await User.findOne({ username: username })
        .select({ password: 1 })
        .then((user) => {
          if (user && user.authenticate(password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err) return done(err);
        });
    }
  )
);

//JWT 이용 로그인 방식
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECREAT_KEY,
    },
    function (jwtPayload, done) {
      return User.findOne({ _id: jwtPayload.id })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

module.exports = passport;
