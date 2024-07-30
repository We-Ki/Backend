const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// const bcrypt = require("bcryptjs");
const User = require("../models/User");

//로컬 로그인 방식(사용자 명, 비밀번호 이용)

passport.use(
  new LocalStrategy(
    {
      usernameField: "username", // 3-1
      passwordField: "password", // 3-1
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
