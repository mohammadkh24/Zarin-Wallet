import { UserEntity } from '../modules/user/entities/user.entity'; // مسیر رو با پروژه خودت تنظیم کن

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity;
    }
  }
}
