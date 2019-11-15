const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();

const handlerFunction = async (event, context, callback) => {
  try {
    const options = {
      TableName: "User",
      FilterExpression: "#active = :active",
      ExpressionAttributeValues: {
        ":active": true
      },
      ExpressionAttributeNames: {
        "#active": "active"
      }
    };
    const user = await docClient.scan(options).promise();
    const sorted = user.Items.sort((a, b) => {
      if (a.userSurname > b.userSurname) {
        return 1;
      }
      if (a.userSurname < b.userSurname) {
        return -1;
      }
      return 0;
    });
    const result = {
      statusCode: 200,
      body: JSON.stringify(sorted),
      headers: { "content-type": "application/json" }
    };

    callback(null, result);
  } catch (e) {
    return context.fail(e);
  }
};
exports.handler = handlerFunction;
