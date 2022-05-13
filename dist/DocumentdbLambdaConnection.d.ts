import { DatabaseClusterProps } from "aws-cdk-lib/aws-docdb";
import { IConnectable, InstanceType, IVpc } from "aws-cdk-lib/aws-ec2";
import { IGrantable } from "aws-cdk-lib/aws-iam";
import { ILayerVersion } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
declare type DocumentdbClusterLambdaConnectionProps = Omit<DatabaseClusterProps, "vpc" | "instanceType"> & {
    vpc?: IVpc;
    instanceType?: InstanceType;
};
export declare class DocumentdbClusterLambdaConnection extends Construct {
    readonly vpc: IVpc;
    private certificateLayer;
    private dbCluster;
    constructor(scope: Construct, id: string, props: DocumentdbClusterLambdaConnectionProps);
    allowCommunication(...lambdas: (IConnectable & IGrantable & {
        addLayers: (...layers: ILayerVersion[]) => void;
    })[]): void;
}
export {};
