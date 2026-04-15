import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedFirebaseToken } from '../../../infrastructure/auth/firebase/firebase-auth.adapter';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): DecodedFirebaseToken => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
