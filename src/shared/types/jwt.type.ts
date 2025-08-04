export type JwtPayload = {
  UserID: string;
  exp?: number;
  iat?: number;
};

export type RefreshTokenBodyDTO = {
  refreshToken: string;
};
