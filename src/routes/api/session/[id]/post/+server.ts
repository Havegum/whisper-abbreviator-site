import { createClient } from '$lib/wa-api/api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ fetch, params, request }) => {
  const client = createClient(fetch);
  const data = await request.formData();
  const body = {
    ...Object.fromEntries(data),
    uuid: params.id,
  };

  const response = await client[`/api/v1/session/{id}`].patch({
    params,
    json: body,
  });

  return json(response);
};
