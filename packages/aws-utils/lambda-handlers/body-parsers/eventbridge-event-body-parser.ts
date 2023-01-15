import { Event } from 'event-utils';

export const eventbridgeEventBodyParser = <T>(body: string): Event<T> => {
  const data = JSON.parse(body);
  return data.detail as Event<T>;
};
