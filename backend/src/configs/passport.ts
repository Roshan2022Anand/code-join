import passport from "passport";
import GitHubStrategy from "passport-github";
import dotenv from "dotenv"

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

//Github strategy from passport
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "http://localhost:5000/auth/callback/github",
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

export default passport;