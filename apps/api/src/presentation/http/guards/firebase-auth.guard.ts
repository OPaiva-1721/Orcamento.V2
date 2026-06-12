import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FirebaseAuthAdapter } from '../../../infrastructure/auth/firebase/firebase-auth.adapter';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseAuth: FirebaseAuthAdapter,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    if (!token)
      throw new UnauthorizedException('Token de autenticação não fornecido');

    try {
      const decoded = await this.firebaseAuth.verifyToken(token);
      request.user = decoded;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private extractToken(request: any): string | null {
    const [type, token] = (request.headers['authorization'] ?? '').split(' ');
    return type === 'Bearer' ? token : null;
  }
}
