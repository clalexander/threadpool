import { paramsSerializer } from 'api-client';
import { EventBridgeEvent } from 'aws-lambda';
import { aws, SQSHandler } from 'aws-utils';
import { Event } from 'event-utils';
import SuperJSON from 'superjson';
import { BUCKET_NAME, LOG_EVENTS } from './constants';
import { eventKey, eventMetadata, eventRedact } from './utils';

const s3 = aws().s3();

const eventHandler = async (ebEvent: EventBridgeEvent<string, Event>) => {
  const event = {
    ...ebEvent.detail,
    id: ebEvent.id,
  };
  // key
  const key = eventKey(event);
  // metadata
  const metadata = eventMetadata(event);
  // redact patterns
  eventRedact(event);
  // write event to bucket
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: SuperJSON.stringify(event),
    ContentType: 'application/json',
    StorageClass: 'INTELLIGENT_TIERING',
    Metadata: metadata,
    Tagging: paramsSerializer(metadata),
  };
  const response = s3.putObject(params);
  await response.promise();
  // maybe log event
  if (LOG_EVENTS) {
    console.log(SuperJSON.stringify(event)); // eslint-disable-line no-console
  }
};

export const handler = SQSHandler(eventHandler, {
  eventRedact: (ebEvent) => eventRedact(ebEvent.detail),
});
