export abstract class Storage {
  abstract createGetSignedUrl(hash: string): Promise<string>;
  abstract createPutSignedUrl(hash: string): Promise<string>;
}
