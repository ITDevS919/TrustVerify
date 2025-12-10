import passport from "passport";
import { Strategy as GitHubStrategy, StrategyOptionsWithRequest } from "passport-github2";
import { Express } from "express";
import { storage } from "./storage";
import dotenv from "dotenv";

dotenv.config();

export function setupGitHubAuth(app: Express) {
  // Only setup GitHub OAuth if credentials are provided
  if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.log("GitHub OAuth credentials not found - skipping GitHub authentication setup");
    return;
  }

  // Determine the callback URL based on environment
  // Priority: GITHUB_CALLBACK_URL > FRONTEND_URL > SERVER_URL > relative path
  const callbackPath = '/auth/github/callback';
  let callbackURL: string;
  const baseUrl = process.env.FRONTEND_URL || process.env.SERVER_URL || '';
  callbackURL = baseUrl 
    ? `${baseUrl}${callbackPath}` 
    : callbackPath; // Relative path if no base URL is set

  console.log(`GitHub OAuth callback URL: ${callbackURL}`);
  console.log(`⚠️  Make sure this exact URL is added to GitHub OAuth App → Settings → Authorization callback URL`);

  // GitHub OAuth Strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: callbackURL,
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
      
      // GitHub profile structure: 
      // - profile.displayName (if set in GitHub profile)
      // - profile.name (from GitHub API)
      // - profile.username (always available)
      // - profile._json contains raw GitHub API response
      const displayName = profile.displayName || profile.name || '';
      const firstName = displayName ? displayName.split(' ')[0] : null;
      const lastName = displayName ? displayName.split(' ').slice(1).join(' ') : null;
      
      // Try multiple sources for profile image
      const profileImage = profile.photos?.[0]?.value || 
                          profile._json?.avatar_url || 
                          null;
      
      if (!email) {
        console.error('GitHub OAuth: No email found in profile', { 
          profileId: profile.id, 
          username: profile.username,
          hasEmails: !!profile.emails,
          emailCount: profile.emails?.length 
        });
        return done(new Error("No email found in GitHub profile. Please ensure your GitHub account has a verified email address."));
      }

      // Check if user already exists
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // Update existing user with GitHub info if they signed up locally
        if (!user.githubId) {
          user = await storage.updateUser(user.id, {
            githubId: profile.id.toString(),
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
        githubId: profile.id.toString(),
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
