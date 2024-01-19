import { createClient as createFetsClient, type NormalizeOAS } from 'fets';
import type openAPIDoc from '$lib/wa-api/openapi';

export type WAType = NormalizeOAS<typeof openAPIDoc>;

export const endpoint = new URL('http://0.0.0.0:8000');

export const createClient = (fetchFn: typeof fetch) =>
  createFetsClient<WAType>({
    endpoint: endpoint.toString().replace(/\/$/, ''),
    fetchFn,
  });
