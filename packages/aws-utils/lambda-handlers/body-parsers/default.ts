import { convertDateStrings } from 'utils';

export const defaultBodyParser = <T>(body: string): T => {
  const data = JSON.parse(body);
  return convertDateStrings(data);
};
