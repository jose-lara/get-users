const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const handlerFunction = async (event, context, callback) => {
  try {
    const options = {
      TableName: 'User',
      FilterExpression: '#active = :active',
      ExpressionAttributeValues: {
        ':active': true
      },
      ExpressionAttributeNames: {
        '#active': 'active'
      }
    };
    const users = await docClient.scan(options).promise();
    const result = {
      statusCode: 200,
      body: users.Items,
      headers: { 'content-type': 'application/json' }
    };

    callback(null, result);
  } catch (e) {
    return context.fail(e);
  }
};
exports.handler = handlerFunction;
