import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FIREBASE_APP = 'FIREBASE_APP';

export const FirebaseAdminProvider = {
  provide: FIREBASE_APP,
  inject: [ConfigService],
  useFactory: (config: ConfigService): admin.app.App => {
    const projectId = config.getOrThrow<string>('FIREBASE_PROJECT_ID');
    const privateKey = config
      .getOrThrow<string>('FIREBASE_PRIVATE_KEY')
      .replace(/\\n/g, '\n');
    const clientEmail = config.getOrThrow<string>('FIREBASE_CLIENT_EMAIL');

    return admin.initializeApp({
      credential: admin.credential.cert({ projectId, privateKey, clientEmail }),
    });
  },
};
