import { userModel } from "../../db";
const GoogleStrategy = require("passport-google-oauth2").Strategy;

const google = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectURL: "http://localhost:5000",
    callbackURL: "http://localhost:5000/api/auth/google/callback",
    session: false,
    passReqToCallback: true,
  },
  async function (req, accessToken, refreshToken, profile, done) {
    const {email, name} = profile._json
    const user = await userModel.findByEmail(email)
    if(user){
      return done(null, user)
    }
    const createdUser = await userModel.create({
      fullName: name,
      email,
      password: "GOOGLE_OAUTH",
    })
    return done(null, createdUser);
  }
);

export { google };
