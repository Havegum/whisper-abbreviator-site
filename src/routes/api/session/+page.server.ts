import type { Actions } from './$types';
import { createClient } from '$lib/wa-api/api';

export const actions = {
  default: async event => {
    const data = await event.request.formData();
    const number = `${data.get('number')}`;
    const payload = { json: { number } };
    const client = createClient(event.fetch);
    const response = await client['/api/v1/session'].post(payload);
    const jsonRes = await response.json();

    return jsonRes;
  },
} satisfies Actions;
