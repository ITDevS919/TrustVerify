import passport from "passport";
import { Strategy as AppleStrategy } from "passport-apple";
import { Express } from "express";
import { storage } from "./storage";

export function setupAppleAuth(app: Express) {
  // Only setup Apple OAuth if credentials are provided
  if (!process.env.APPLE_CLIENT_ID || !process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID || !process.env.APPLE_PRIVATE_KEY) {
    console.log("Apple OAuth credentials not found - skipping Apple authentication setup");
    return;
  }

  // Apple OAuth Strategy
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyString: process.env.APPLE_PRIVATE_KEY,
    callbackURL: "/auth/apple/callback",
    scope: ['name', 'email'],
    passReqToCallback: false
  },
  async (_accessToken: any, _refreshToken: any, idToken: any, profile: any, done: any) => {
    try {
      const email = profile.email || idToken?.email;
      const firstName = profile.name?.firstName;
      const lastName = profile.name?.lastName;
      
      if (!email) {
        return done(new Error("No email found in Apple profile"));
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with Apple info if they signed up locally
        if (!user.appleId) {
          user = await storage.updateUser(user.id, {
            appleId: profile.id || idToken?.sub || profile.sub,
            authProvider: 'apple',
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
        authProvider: 'apple',
        appleId: profile.id || idToken?.sub || profile.sub,
        isVerified: true,
      });

      return done(null, newUser);
    } catch (error) {
      console.error('Apple OAuth error:', error);
      return done(error);
    }
  }));

  // Apple OAuth routes
  app.get('/auth/apple',
    passport.authenticate('apple')
  );

  app.post('/auth/apple/callback',
    passport.authenticate('apple', { failureRedirect: '/login?error=apple_auth_failed' }),
    (_req, res) => {
      // Successful authentication
      res.redirect('/dashboard');
    }
  );
}
