import type { Actions } from './$types';
import { endpoint } from '$lib/wa-api/api';

export const actions = {
  default: async event => {
    console.log('got event', event);

    const data = await event.request.formData();

    const file = data.get('audio_file');

    if (!file) {
      throw new Error('audio_file is required');
    } else if (!(file instanceof Blob)) {
      throw new Error('audio_file must be a file');
    } else if (file.size === 0) {
      throw new Error('audio_file is empty');
    }

    const url = new URL(`/api/v1/recording`, endpoint);
    url.searchParams.set('session_id', `${data.get('session_id')}`);

    if (data.has('transcribe')) {
      url.searchParams.set('transcribe', 'true');
    }

    if (data.has('summarize')) {
      url.searchParams.set('summarize', 'true');
    }
    console.log('post', url);

    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });

    const jsonRes = await response.json();

    return jsonRes;
  },
} satisfies Actions;
