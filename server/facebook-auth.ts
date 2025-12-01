import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Express } from "express";
import { storage } from "./storage";
import dotenv from "dotenv";

dotenv.config();

export function setupFacebookAuth(app: Express) {
  // Only setup Facebook OAuth if credentials are provided
  if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
    console.log("Facebook OAuth credentials not found - skipping Facebook authentication setup");
    return;
  }

  // Facebook OAuth Strategy
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name', 'photos']
  },
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ) => {
    try {
      const email = profile.emails?.[0]?.value;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      const profileImage = profile.photos?.[0]?.value;
      
      if (!email) {
        return done(new Error("No email found in Facebook profile"));
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with Facebook info if they signed up locally
        if (!user.facebookId) {
          user = await storage.updateUser(user.id, {
            facebookId: profile.id,
            authProvider: 'facebook',
            profileImage: profileImage || user.profileImage,
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            isVerified: true,
          });
        }
        
        return done(null, user);
      }

      // Create new user
      const newUser = await storage.createUser({
        email,
        username: email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5),
        firstName: firstName || null,
        lastName: lastName || null,
        profileImage: profileImage || null,
        authProvider: 'facebook',
        facebookId: profile.id,
        isVerified: true,
      });

      return done(null, newUser);
    } catch (error) {
      console.error('Facebook OAuth error:', error);
      return done(error);
    }
  }));

  // Facebook OAuth routes
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
  );

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login?error=facebook_auth_failed' }),
    (_req, res) => {
      // Successful authentication
      res.redirect('/dashboard');
    }
  );
}
