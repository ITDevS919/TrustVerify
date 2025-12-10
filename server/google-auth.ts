import passport from "passport";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { Express } from "express";
import { storage } from "./storage";
import dotenv from "dotenv";

dotenv.config();

export function setupGoogleAuth(app: Express) {
  // Only setup Google OAuth if credentials are provided
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.log("Google OAuth credentials not found - skipping Google authentication setup");
    return;
  }

  // Determine the callback URL based on environment
  // Priority: GOOGLE_CALLBACK_URL > FRONTEND_URL > SERVER_URL > relative path
  const callbackPath = '/auth/google/callback';
  let callbackURL: string;
  const baseUrl = process.env.FRONTEND_URL || process.env.SERVER_URL || '';
  callbackURL = baseUrl 
    ? `${baseUrl}${callbackPath}` 
    : callbackPath; // Relative path if no base URL is set

  console.log(`Google OAuth callback URL: ${callbackURL}`);
  console.log(`⚠️  Make sure this exact URL is added to Google Console → OAuth 2.0 Client → Authorized redirect URIs`);
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  },
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) => {
    try {
      const email = profile.emails?.[0]?.value;
      const firstName = profile.name?.givenName;
      const lastName = profile.name?.familyName;
      const profileImage = profile.photos?.[0]?.value;
      
      if (!email) {
        return done(new Error("No email found in Google profile"));
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with Google info if they signed up locally
        if (!user.googleId) {
          user = await storage.updateUser(user.id, {
            googleId: profile.id,
            authProvider: 'google',
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
        authProvider: 'google',
        googleId: profile.id,
        isVerified: true,
      });

      return done(null, newUser);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error);
    }
  }));

  // Google OAuth routes
  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed' }),
    (_req, res) => {
      // Successful authentication
      res.redirect('/dashboard');
    }
  );
}