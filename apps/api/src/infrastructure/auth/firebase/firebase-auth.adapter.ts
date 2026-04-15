import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_APP } from './firebase-admin.provider';

export interface DecodedFirebaseToken {
  uid: string;
  email?: string;
  name?: string;
}

@Injectable()
export class FirebaseAuthAdapter {
  constructor(@Inject(FIREBASE_APP) private readonly app: admin.app.App) {}

  async verifyToken(token: string): Promise<DecodedFirebaseToken> {
    const decoded = await this.app.auth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email, name: decoded.name };
  }
}
