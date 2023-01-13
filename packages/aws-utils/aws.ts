import AWS from 'aws-sdk';

/**
 * Specify api versions
 */
AWS.config.apiVersions = {
  secretsmanager: '2017-10-17',
  ssm: '2014-11-06',
  sns: '2010-03-31',
  eventbridge: '2015-10-07',
};

/**
 * Manages AWS object instaning
 */
export class AwsManager {
  /**
   * Creates an AWS secret manager
   *
   * @returns {AWS.SecretsManager}
   */
  secretsManager(): AWS.SecretsManager {
    return new AWS.SecretsManager();
  }

  /**
   * Creates an AWS Services Systems Manager (SSM)
   *
   * @returns {AWS.SSM}
   */
  ssm(): AWS.SSM {
    return new AWS.SSM();
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
   * Creates an AWS sns
   *
   * @returns {AWS.EventBridge}
   */
  eventbridge(): AWS.EventBridge {
    return new AWS.EventBridge();
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
