export abstract class Storage {
  abstract createGetAndPutSignedUrl(
    hash: string
  ): Promise<{ [key: string]: { get: string; put: string } }>;
}
