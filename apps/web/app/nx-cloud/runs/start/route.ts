async function signGetUrl(hash: string) {
  return hash;
}

async function signPutUrl(hash: string) {
  return hash;
}

export async function POST(request: Request) {
  const body = await request.json();

  const { hashes } = body;

  const entities = await Promise.all(
    hashes.map(async (hash: string) => {
      const get = await signGetUrl(hash);
      const put = await signPutUrl(hash);
      return [hash, { get, put }];
    })
  );

  const urls = Object.fromEntries(entities);

  return Response.json({ urls });
}
