# Aws lambda talk how to get all users in dynamo

Ordenar los usuarios por apellido

Usuarios existentes:

```json
[
  {
    "userName": "German",
    "active": true,
    "role": "user",
    "userId": "3c9c32e0-0663-11ea-bb31-0f32554f313b",
    "userSurname": "Rodriguez"
  },
  {
    "userName": "Jose",
    "active": true,
    "role": "admin",
    "userId": "cec4cc70-0647-11ea-99b5-91f4ad56f3c9",
    "userSurname": "Lara"
  },
  {
    "userName": "Luis",
    "active": true,
    "role": "admin",
    "userId": "e52f2e10-0656-11ea-b8c3-ad5d91623fe5",
    "userSurname": "Prieto"
  }
]
```

Añadir la llamada al layer donde se hacen las llamadas a AWS. El codigo del modulo del layer es el siguiente

```js
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();

const getAllUsers = async () => {
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
  const user = await docClient.scan(options).promise();
  return user.Items;
};

const getUserById = async ({ userId }) => {
  const options = {
    TableName: 'User',
    Key: { userId }
  };
  const user = await docClient.get(options).promise();
  return user.Item;
};

const updateUser = async options => await docClient.update(options).promise();

const createUser = async options => await docClient.put(options).promise();

const dynamoRequest = (method, options) => {
  switch (method) {
    case 'getUserById':
      return getUserById(options);
    case 'deleteUser':
    case 'updateUser':
      return updateUser(options);
    case 'createUser':
      return createUser(options);
    case 'getAll':
    default:
      return getAllUsers();
  }
};

module.exports = {
  dynamoRequest
};
```
