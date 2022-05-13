import { SymlinkFollowMode } from "aws-cdk-lib";
import { DatabaseCluster, DatabaseClusterProps } from "aws-cdk-lib/aws-docdb";
import {
  IConnectable,
  InstanceClass,
  InstanceSize,
  InstanceType,
  IVpc,
  Port,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import { IGrantable } from "aws-cdk-lib/aws-iam";
import { Code, ILayerVersion, LayerVersion } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { join } from "path";

type DocumentdbClusterLambdaConnectionProps = Omit<
  DatabaseClusterProps,
  "vpc" | "instanceType"
> & {
  vpc?: IVpc;
  instanceType?: InstanceType;
};

export class DocumentdbClusterLambdaConnection extends Construct {
  readonly vpc: IVpc;

  private certificateLayer: ILayerVersion;
  private dbCluster: DatabaseCluster;

  constructor(
    scope: Construct,
    id: string,
    props: DocumentdbClusterLambdaConnectionProps
  ) {
    super(scope, id);
    this.vpc = props.vpc ?? new Vpc(scope, "VPC");

    const dbCluster = new DatabaseCluster(scope, "DocumentdbCluster", {
      storageEncrypted: true,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_NAT,
      },
      vpc: this.vpc,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM),
      ...props,
    });
    this.dbCluster = dbCluster;

    const certificateLayer = new LayerVersion(scope, "CertificateLayer", {
      code: Code.fromAsset(join(__dirname, "certificate"), {
        followSymlinks: SymlinkFollowMode.ALWAYS,
      }),
      layerVersionName: "CertificateLayer",
      description: "Documentdb certificate layer",
    });

    this.certificateLayer = certificateLayer;
  }

  public allowCommunication(
    ...lambdas: (IConnectable &
      IGrantable & { addLayers: (...layers: ILayerVersion[]) => void })[]
  ) {
    lambdas.forEach((lambda) => {
      lambda.addLayers(this.certificateLayer);
      this.dbCluster.secret?.grantRead(lambda);
      this.dbCluster.connections.allowFrom(
        lambda,
        Port.tcp(27017),
        "Allow lambda communication with Documentdb cluster"
      );
    });
  }
}
