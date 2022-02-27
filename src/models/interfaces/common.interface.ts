
export interface IReqStateModel {
  jwtPayload?: IJWTPayloadModel;
}

export interface IJWTPayloadModel {
  identity: string;
  name: string;
  iat: number;
}