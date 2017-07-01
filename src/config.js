export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  cognito: {
    REGION: 'us-west-2',
    IDENTITY_POOL_ID: 'us-west-2:10750392-70db-488b-b572-b24fefe18365',
    USER_POOL_ID : 'us-west-2_gRKodqIkn',
    APP_CLIENT_ID : '2c0d97c7ovkcng8cvu7f5q9v8d',
  },
  apiGateway: {
    URL: 'https://xel1uw5gx1.execute-api.us-west-2.amazonaws.com/prod',
  },
  s3: {
    BUCKET: 'donat'
  },
};
