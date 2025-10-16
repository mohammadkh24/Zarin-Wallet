export enum walletMessage {
    TRANSACTION_SUCCESS= 'پرداخت با موفقیت انجام شد',
    TRANSACTION_NOT_FOUND = 'تراکنش یافت نشد',
    TRANSACTION_DB_ERROR = 'خطا در ثبت تراکنش در دیتابیس',
    TRANSACTION_ERROR = 'پرداخت ناموفق بود',
    INSUFFICIENT_BALANCE_WALLET = 'موجودی کیف پول شما کافی نیست',
    WITHDRAW_SUCCESSFULL = 'برداشت با موفقیت انجام شد'
}

export enum AuthMessage {
    OTP_SENT = 'کد تایید با موفقیت ارسال شد',
    OTP_CREATED = 'کد تایید ساخته شد',
    LOGIN_SUCCESS = 'ورود با موفقیت انجام شد',
    TOKENS_REFRESHED = 'توکن‌ها تازه شدند',
    EMAIL_OTP_SENT = 'کد تایید به ایمیل ارسال شد',
    TOKEN_EXPIRED = 'توکن منقضی شده',
    INVALID_IDENTIFIER = 'اطلاعات وارد شده صحیح نیست',
    INVALID_OTP = 'کد صحیح نیست',
    OTP_EXPIRED = 'کد منقضی شده است',
    OTP_NOT_EXPIRED = 'کد قبلی هنوز منقضی نشده. لطفاً کمی صبر کنید.',
    INVALID_TOKEN = 'توکن نامعتبر است',
    INVALID_REFRESH_TOKEN = 'توکن رفرش نامعتبر یا منقضی شده است',
    SMS_CONFIG_MISSING = 'تنظیمات پیامک ناقص است. لطفاً SMS_USERNAME، SMS_PASSWORD، SMS_FROM و VERIFY_PATTERN_CODE را بررسی کنید.',
    SMS_FAILED = 'ارسال پیامک ناموفق بود',
    EMAIL_NOT_FOUND = 'ایمیل موجود نیست',
    INCORRECT_PHONE_FORMAT= 'فرمت شماره موبایل صحیح نیست'
  }

export enum userMessages {
    USER_NOT_FOUND = 'کاربر یافت نشد'
}