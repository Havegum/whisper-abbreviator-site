import type { PageLoad } from './$types';
import { createClient } from '$lib/wa-api/api';

export const load: PageLoad = async ({ fetch, params }) => {
  const client = createClient(fetch);
  const recordings = client['/api/v1/recording'].get().then(res => res.json());
  const sessions = client['/api/v1/session'].get().then(res => res.json());

  return {
    recordings: await recordings,
    sessions: await sessions,
  };
};
