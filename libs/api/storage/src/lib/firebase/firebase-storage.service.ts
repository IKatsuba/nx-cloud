import { Storage } from '../storage';
import * as firebase from 'firebase-admin';

export class FirebaseStorageService extends Storage {
  private firebaseApp = firebase.initializeApp({
    credential: firebase.credential.applicationDefault(),
    storageBucket: 'nx-cloud-ce.appspot.com',
  });

  async createGetSignedUrl(hash: string): Promise<string> {
    const bucket = this.firebaseApp.storage().bucket();

    const file = bucket.file(hash);

    const [getUrl] = (await file.exists())
      ? await file.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 18000000,
        })
      : null;

    return getUrl;
  }

  async createPutSignedUrl(hash: string): Promise<string> {
    const bucket = this.firebaseApp.storage().bucket();

    const file = bucket.file(hash);

    const [putUrl] = await file.getSignedUrl({
      contentType: 'application/octet-stream',
      version: 'v4',
      action: 'write',
      expires: Date.now() + 18000000,
    });

    return putUrl;
  }
}
