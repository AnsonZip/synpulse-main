import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

async function auth(req: Request, res: Response, next: NextFunction) {
  let execAuth = (req: Request, res: Response): Promise<string> => {
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
      const clientName = await execAuth(req, res);

      if (clientName) {
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