import { createClient } from '$lib/wa-api/api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ fetch, params }) => {
  const client = createClient(fetch);
  const response = await client[`/api/v1/recording/{id}`].delete({ params });
  const jsonRes = await response.json();

  return json(jsonRes);
};
