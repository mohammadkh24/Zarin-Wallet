import { UserEntity } from "src/modules/user/entities/user.entity";

export type ValidateAccessTokenResult = {
    user?: UserEntity | null
    message?: string;
  };
  