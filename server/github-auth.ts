import passport from "passport";
import { Strategy as GitHubStrategy, StrategyOptionsWithRequest } from "passport-github2";
import { Express } from "express";
import { storage } from "./storage";

export function setupGitHubAuth(app: Express) {
  // Only setup GitHub OAuth if credentials are provided
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.log("GitHub OAuth credentials not found - skipping GitHub authentication setup");
    return;
  }

  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback",
    scope: ['user:email']
  } as StrategyOptionsWithRequest,
  async (
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void
  ) => {
    try {
      const email = profile.emails?.[0]?.value;
      const firstName = profile.displayName?.split(' ')[0];
      const lastName = profile.displayName?.split(' ').slice(1).join(' ');
      const profileImage = profile.photos?.[0]?.value;
      
      if (!email) {
        return done(new Error("No email found in GitHub profile"));
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with GitHub info if they signed up locally
        if (!user.githubId) {
          user = await storage.updateUser(user.id, {
            githubId: profile.id,
            authProvider: 'github',
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
        username: profile.username || email.split('@')[0] + '_' + Math.random().toString(36).substr(2, 5),
        firstName: firstName || null,
        lastName: lastName || null,
        profileImage: profileImage || null,
        authProvider: 'github',
        githubId: profile.id,
        isVerified: true,
      });

      return done(null, newUser);
    } catch (error) {
      console.error('GitHub OAuth error:', error);
      return done(error);
    }
  }));

  // GitHub OAuth routes
  app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
  );

  app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login?error=github_auth_failed' }),
    (_req, res) => {
      // Successful authentication
      res.redirect('/dashboard');
    }
  );
}
