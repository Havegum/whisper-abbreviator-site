import { createClient } from '$lib/wa-api/api.js';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export let POST: RequestHandler = async ({ fetch, request }) => {
  const client = createClient(fetch);
  const response = await client[`/api/v1/chunk/similar`].post({
    query: await request.json(),
  });
  const jsonRes = await response.json();
  console.log(jsonRes);
  return json(jsonRes);
};
