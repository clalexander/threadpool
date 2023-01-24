import { aws } from 'aws-utils';
import SuperJSON from 'superjson';
import { BUCKET_NAME } from './constants';

const s3 = aws().s3();

const STATE_KEY = 'state';

export interface State {
  lastStartTime?: number;
}

export const getState = async (): Promise<State | null> => {
  try {
    const response = s3.getObject({
      Bucket: BUCKET_NAME,
      Key: STATE_KEY,
    });
    const result = await response.promise();
    const data = result.Body?.toString('utf-8');
    return SuperJSON.parse<State>(data || '');
  } catch (error: any) {
    // return null only if state wasn't found
    if (error.code === 'NoSuchKey') {
      return null;
    }
    throw error;
  }
};

export const setState = async (state: State): Promise<void> => {
  const response = s3.putObject({
    Bucket: BUCKET_NAME,
    Key: STATE_KEY,
    Body: SuperJSON.stringify(state),
    ContentType: 'application/json',
  });
  await response.promise();
};
