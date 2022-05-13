# Lambda to Documentdb connection

This package provides a CDK construct facilitating the connection between a lambda and a Documentdb cluster.

## How to use it

- Instanciate `DocumentdbClusterLambdaConnection` in your stack CDK, by specifying at least the master user for accessing Documentdb. You can also specify the vpc you want your clusters in (otherwise the construct will provision one):

```typescript
const documentdbCluster = new DocumentdbClusterLambdaConnection(
  this,
  "MyDocumentDbConnection",
  masterUser: { username: "yourUsername", secretName: "documentdbSecretName" }
);
```

- Define the lambdas that will communicate with Documentdb in the same VPC:

```typescript
const lambda1 = new NodejsFunction(this, "MyFirstLambda", {
  vpc: documentdbCluster.vpc,
  ...restOfLambdaConfiguration,
});
const lambda2 = new NodejsFunction(this, "MySecondLambda", {
  vpc: documentdbCluster.vpc,
  ...restOfLambdaConfiguration,
});
```

- Give your lambdas the rights to communicate with your Documentdb cluster:

```typescript
documentdbCluster.allowCommunication(lambda1, lambda2);
```

- In the lambda handlers, retrieve the database secrets from SecretsManager, and use them with the Mongo client:

```typescript
import { SecretsManager } from "aws-sdk";
import { MongoClient } from "mongodb";

export const main = async () => {
  const dbClient = await connectToDatabase();

  const db = dbClient.db("db");

  await db.collection("collection").insertOne({ property: "value" });

  return {
    statusCode: 200,
    body: "...",
  };
};

const connectToDatabase = async (): Promise<MongoClient> => {
  if (cachedDb) {
    return Promise.resolve(cachedDb);
  }

  const secretsManager = new SecretsManager({ region: "eu-west-1" });

  const secret = await secretsManager
    .getSecretValue({ SecretId: "documentdbSecretName" })
    .promise();

  const secretString = secret.SecretString;

  if (secretString === undefined) {
    throw new Error();
  }

  const docdbsecret = JSON.parse(secretString) as {
    password: string;
    host: string;
    username: string;
  };

  const { password, host, username } = docdbsecret;

  db = await MongoClient.connect(
    `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(
      password
    )}@${host}`,
    {
      ssl: true,
      sslCA: "/opt/rds-combined-ca-bundle.pem", // https://docs.aws.amazon.com/documentdb/latest/developerguide/ca_cert_rotation.html#ca_cert_rotation-updating_application_step1
      retryWrites: false,
      connectTimeoutMS: 3000,
    }
  );

  cachedDb = db;

  return cachedDb;
};
```

Built by

<a href="https://dev.to/kumo" title="Kumo"><img src="docs/kumo.png" width="130"></a>
