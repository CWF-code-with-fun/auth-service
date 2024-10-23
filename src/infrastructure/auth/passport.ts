/* eslint-disable @typescript-eslint/no-misused-promises */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';
import { UserService } from '../../domain/services/UserService';
import { User } from '../../domain/entities/User';
import { Email } from '../../domain/valueObjects/Email';

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: '/auth/google/callback',
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error('No email found'), false);
                }

                let user = await userService.findUserByEmail(new Email(email));
                if (!user) {
                    user = await userService.registerUser(new Email(email), ''); // Password can be empty or a random string
                }

                done(null, user);
            } catch (error) {
                done(error, false);
            }
        },
    ),
);

passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await userService.findUserById(id);
        done(null, user as Express.User);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
