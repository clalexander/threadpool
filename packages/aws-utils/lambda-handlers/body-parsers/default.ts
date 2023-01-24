import SuperJSON from 'superjson';

export const defaultBodyParser = <T>(body: string): T => SuperJSON.parse(body);
