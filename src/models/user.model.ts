import { IsAlpha, IsNotEmpty, IsString } from 'class-validator';
import IUser from './interfaces/user.interface';

/**
 * An user schema
 */
export default class User implements IUser {
  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  public mobileNumber?: string;

  @IsString()
  @IsAlpha()
  @IsNotEmpty()
  public username?: string;

  public otp?: string;

  public watchlist?: string[];

  public portfolio?: any;

  constructor(data: IUser) {
    Object.assign(this, data);
  }
}
