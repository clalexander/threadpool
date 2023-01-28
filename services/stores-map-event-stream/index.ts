import { DynamoDBRecord } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { DynamoDBStreamHandler } from 'aws-utils';
import { publishEvent } from 'event-utils';
import { StoresMap, StoresMapRecordMutation } from 'types';
import { TARGET_EVENTBRIDGE_ARN } from './constants';

const recordHandler = async (record: DynamoDBRecord) => {
  const {
    eventName,
    dynamodb,
  } = record;
  const {
    NewImage,
    OldImage,
  } = dynamodb || {};
  const newStoresMap: StoresMap | undefined = NewImage
    && DynamoDB.Converter.unmarshall(NewImage) as StoresMap;
  const oldStoresMap: StoresMap | undefined = OldImage
    && DynamoDB.Converter.unmarshall(OldImage) as StoresMap;
  const data: StoresMapRecordMutation = {
    oldRecord: oldStoresMap,
    newRecord: newStoresMap,
  };
  switch (eventName) {
    case 'INSERT':
      if (!newStoresMap) {
        throw new Error('Missing NewImage for INSERT event');
      }
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: 'stores_map.created',
        data,
      });
      break;
    case 'MODIFY':
      if (!newStoresMap) {
        throw new Error('Missing NewImage for MODIFY event');
      }
      if (!oldStoresMap) {
        throw new Error('Missing OldImage for MODIFY event');
      }
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: 'stores_map.updated',
        data,
      });
      break;
    case 'REMOVE':
      if (!oldStoresMap) {
        throw new Error('Missing OldImage for REMOVE event');
      }
      await publishEvent({
        bus: TARGET_EVENTBRIDGE_ARN,
        type: 'stores_map.deleted',
        data,
      });
      break;
    default:
      throw new Error('Missing eventName');
  }
};

const errorHandler = async (error: any) => {
  // lifecycle: service failed
  await publishEvent({
    bus: TARGET_EVENTBRIDGE_ARN,
    type: 'service.stores_map_event_stream.failed',
    data: error,
  });
  return false;
};

export const handler = DynamoDBStreamHandler(recordHandler, { errorHandler });
