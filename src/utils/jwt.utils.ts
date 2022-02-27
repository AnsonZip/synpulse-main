import passport from 'passport';
import * as passportJWT from 'passport-jwt';
import { jwtSecret } from '../config/dev.config';

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const authStrategy = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
}

passport.use('authenicate', new JwtStrategy(authStrategy, function (jwt_payload, done) {
  try {
    done(null, jwt_payload);
  } catch (err) {
    done(err);
  }
}));