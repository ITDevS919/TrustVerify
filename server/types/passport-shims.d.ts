declare module "passport";

declare module "passport-google-oauth20" {
    import { Profile as PassportProfile } from "passport";
  
    export interface Profile extends PassportProfile {
      emails?: Array<{ value: string }>;
      photos?: Array<{ value: string }>;
    }
  
    export interface StrategyOptions {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
    }
  
    export interface VerifyCallback {
      (error: any, user?: any, info?: any): void;
    }
  
    export class Strategy {
      constructor(
        options: StrategyOptions,
        verify: (
          accessToken: string,
          refreshToken: string,
          profile: Profile,
          done: VerifyCallback
        ) => void
      );
    }
  }
  

  declare module "passport-facebook" {
    import { Profile as PassportProfile } from "passport";
  
    export interface Profile extends PassportProfile {
      emails?: Array<{ value: string }>;
      photos?: Array<{ value: string }>;
    }
  
    export interface StrategyOption {
      clientID: string;
      clientSecret: string;
      callbackURL: string;
      profileFields?: string[];
    }
  
    export interface VerifyFunction {
      (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void): void;
    }
  
    export class Strategy {
      constructor(options: StrategyOption, verify: VerifyFunction);
    }
  }