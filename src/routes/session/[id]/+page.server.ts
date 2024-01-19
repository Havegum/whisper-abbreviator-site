import { base } from '$app/paths';
import { createClient } from '$lib/wa-api/api';
import type { PageLoad } from './$types';

export let load: PageLoad = async ({ fetch, params }) => {
  const { id } = params;
  const session = await fetch(`${base}/api/session/${id}.json`).then(res =>
    res.json(),
  );

  const client = createClient(fetch);
  console.log('client', typeof client);

  const recordingsRequest = await client['/api/v1/session/{id}/recordings'].get(
    { params },
  );

  let recordings = await recordingsRequest.json();
  let recording = recordings[0];
  if (recording) {
    const transcripts = await fetch(
      `${base}/api/recording/${recording.uuid}/transcripts`,
    ).then(d => d.json());

    recording = {
      ...recording,
      transcript: transcripts[0],
    };
  }

  return {
    session: session,
    recording: recording,
  };
};
