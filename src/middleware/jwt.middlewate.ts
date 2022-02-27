import passport from 'passport';
import { Request, Response, NextFunction } from 'express';
import { IJWTPayloadModel } from '../models/interfaces/common.interface';

async function auth(req: Request, res: Response, next: NextFunction) {
  let execAuth = (req: Request, res: Response): Promise<IJWTPayloadModel> => {
    return new Promise((resolve, reject) => {
      passport.authenticate('authenicate', (err, jwt_payload: any) => {
        if (err) {
          return reject(new Error(err));
        }
        else if (!jwt_payload) {
          return reject(new Error('not authenticated'));
        }

        return resolve(jwt_payload);
      })(req, res)
    })
  }

  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const jwt_payload = await execAuth(req, res);

      if (jwt_payload) {
        req.cookies = jwt_payload;
        return next();
      }
    }

    return res.status(403).json({ msg: 'not authenticated' });
  }
  catch (err) {
    return res.status(403).json({ msg: 'not authenticated' });
  }
}

export default auth
