import { Match, Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SubnetType } from "aws-cdk-lib/aws-ec2";
import { DocumentdbClusterLambdaConnection } from "../lib";

describe("DocumentdbClusterLambdaConnection", () => {
  const stack = new cdk.Stack();

  const dbCluster = new DocumentdbClusterLambdaConnection(stack, "connection", {
    masterUser: { username: "ZinedineZidane", secretName: "documentdbSecret" },
  });

  const lambda = new NodejsFunction(stack, "Lambda", {
    entry: "test/handler.ts",
    runtime: Runtime.NODEJS_14_X,
    handler: "main",
    vpc: dbCluster.vpc,
    vpcSubnets: {
      subnetType: SubnetType.PRIVATE_WITH_NAT,
    },
  });

  dbCluster.allowCommunication(lambda);

  const template = Template.fromStack(stack);

  test("creates an lambda layer for certificates", () => {
    template.hasResourceProperties("AWS::Lambda::LayerVersion", {
      Content: {
        S3Bucket: Match.anyValue(),
        S3Key: Match.anyValue(),
      },
      LayerName: "CertificateLayer",
      Description: "Documentdb certificate layer",
    });
  });

  test("attaches private subnets to documentdb", () => {
    template.hasResourceProperties("AWS::DocDB::DBSubnetGroup", {
      SubnetIds: dbCluster.vpc.privateSubnets.map(
        ({ subnetId }) => stack.resolve(subnetId) as string
      ),
      DBSubnetGroupDescription: "Subnets for DocumentdbCluster database",
    });
  });

  test("attaches private subnets to documentdb", () => {
    template.hasResourceProperties("AWS::EC2::SecurityGroupIngress", {
      IpProtocol: "tcp",
      Description: "Allow lambda communication with Documentdb cluster",
      ToPort: 27017,
    });
  });
});
