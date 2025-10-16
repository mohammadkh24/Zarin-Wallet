import { BadRequestException } from '@nestjs/common';
import { AuthMessage } from '../enums/messages';

export function detectIdentifierType(identifier: string): 'phone'{
  const phoneRegex = /^(\+98|0)?9\d{9}$/;

  if (phoneRegex.test(identifier)) return 'phone';

  throw new BadRequestException(AuthMessage.INVALID_IDENTIFIER);
}
