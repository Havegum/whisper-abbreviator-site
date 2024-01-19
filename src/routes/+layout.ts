import type { OASModel } from 'fets';
import type { LayoutLoad } from './$types';
import type { WAType } from '$lib/wa-api/api';
import { base } from '$app/paths';

export const prerender = true;
export const trailingSlash = 'always';

type Session = OASModel<WAType, 'Session'>;

const sortBySessionNumber = (arr: Session[]) =>
  arr.sort((a, b) =>
    (a.number ?? '').localeCompare(b.number ?? '', undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );

export const load: LayoutLoad = async event => {
  return {
    sessions: await event
      .fetch(`${base}/api/sessions.json`)
      .then(res => res.json() as Promise<Session[]>)
      .then(sortBySessionNumber),
  };
};
