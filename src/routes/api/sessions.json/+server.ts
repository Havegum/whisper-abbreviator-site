import { createClient } from '$lib/wa-api/api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ fetch, params }) => {
  const client = createClient(fetch);
  const response = await client[`/api/v1/session`].get();
  const jsonRes = await response.json();

  return json(jsonRes);
};
