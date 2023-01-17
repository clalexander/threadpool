import AWS from 'aws-sdk';

/**
 * Specify api versions
 */
AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
  eventbridge: '2015-10-07',
  s3: '2006-03-01',
  secretsmanager: '2017-10-17',
  sns: '2010-03-31',
  ssm: '2014-11-06',
};

/**
 * Manages AWS object instaning
 */
export class AwsManager {
  /**
   * Creates an AWS DynamoDB
   *
   * @returns {AWS.DynamoDB}
   */
  dynamoDB(): AWS.DynamoDB {
    return new AWS.DynamoDB();
  }

  /**
   * Creates an AWS eventbridge
   *
   * @returns {AWS.EventBridge}
   */
  eventbridge(): AWS.EventBridge {
    return new AWS.EventBridge();
  }

  /**
   * Creates an AWS S3
   *
   * @returns {AWS.S3}
   */
  s3(): AWS.S3 {
    return new AWS.S3();
  }

  /**
   * Creates an AWS secret manager
   *
   * @returns {AWS.SecretsManager}
   */
  secretsManager(): AWS.SecretsManager {
    return new AWS.SecretsManager();
  }

  /**
   * Creates an AWS sns
   *
   * @returns {AWS.SNS}
   */
  sns(): AWS.SNS {
    return new AWS.SNS();
  }

  /**
   * Creates an AWS Services Systems Manager (SSM)
   *
   * @returns {AWS.SSM}
   */
  ssm(): AWS.SSM {
    return new AWS.SSM();
  }
}

let awsManager: AwsManager;

/**
 * Get a reference to the singleton AwsManager object.
 *
 * @returns {AwsManager}
 */
export function aws(): AwsManager {
  if (!awsManager) {
    awsManager = new AwsManager();
  }
  return awsManager;
}
