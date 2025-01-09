import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import passport from "passport"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "./dotenv.config.js"
import User from "./../models/user.model.js"

console.log('Sushil from passp')

passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            try {
                let user = await User.findOne({ googleId: profile.id })
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0].value,
                    });
                }
                done(null, user);
            }
            catch (error) {
                done(error, null);
            }
        }

    )
)

// Serialize user for session
passport.serializeUser((user, done) => done(null, user.id));


// Deserialize user for session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;


