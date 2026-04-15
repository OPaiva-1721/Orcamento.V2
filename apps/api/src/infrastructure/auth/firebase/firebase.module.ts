import { Global, Module } from '@nestjs/common';
import { FirebaseAdminProvider } from './firebase-admin.provider';
import { FirebaseAuthAdapter } from './firebase-auth.adapter';

@Global()
@Module({
  providers: [FirebaseAdminProvider, FirebaseAuthAdapter],
  exports: [FirebaseAuthAdapter],
})
export class FirebaseModule {}
