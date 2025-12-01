declare module "passport-github2" {
  import { Request } from "express";
  import { Profile as PassportProfile } from "passport";

  export interface Profile extends PassportProfile {
    emails?: Array<{ value: string }>;
    photos?: Array<{ value: string }>;
  }

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    scope?: string[];
  }

  export interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback?: boolean;
  }

  export interface VerifyCallback {
    (error: any, user?: any, info?: any): void;
  }

  export class Strategy {
    constructor(
      options: StrategyOptions | StrategyOptionsWithRequest,
      verify: (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ) => void
    );
  }
}


