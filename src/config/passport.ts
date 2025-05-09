// config/passport.ts
import passport from 'passport'
import { Strategy as LocalStrategy} from "passport-local"
import { User } from '../models/user'

passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({ username })
            if (!user) {
                return done(null, false, { message: 'User not found' })
            }
            const isMatch = await user.verifyPassword(password)
            if (!isMatch) {
                return done(null, false, { message: 'Invalid password'})
            }
            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, (user as any).id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err)
    }
})

export default passport