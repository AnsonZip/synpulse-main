import passport from 'passport';
import * as passportJWT from 'passport-jwt';

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const authStrategy = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'J]##H@_e+1>xRsZ1XAjUEIjB!OEuzV=):4+.ahwo:l7u#oM}.]U4umqKNnPLpfDn'
}

passport.use('authenicate', new JwtStrategy(authStrategy, function (jwt_payload, done) {
  try {
    console.log('jwt', jwt_payload);
    done(null, jwt_payload);
  } catch (err) {
    done(err);
  }
}));