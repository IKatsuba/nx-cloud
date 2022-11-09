import { Module } from '@nestjs/common';
import { Storage } from '../storage';
import { FirebaseStorageService } from './firebase-storage.service';

@Module({
  providers: [
    {
      provide: Storage,
      useClass: FirebaseStorageService,
    },
  ],
  exports: [Storage],
})
export class FirebaseStorageModule {}
