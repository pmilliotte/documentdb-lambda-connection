"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentdbClusterLambdaConnection = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_docdb_1 = require("aws-cdk-lib/aws-docdb");
const aws_ec2_1 = require("aws-cdk-lib/aws-ec2");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const constructs_1 = require("constructs");
const path_1 = require("path");
class DocumentdbClusterLambdaConnection extends constructs_1.Construct {
    constructor(scope, id, props) {
        var _a;
        super(scope, id);
        this.vpc = (_a = props.vpc) !== null && _a !== void 0 ? _a : new aws_ec2_1.Vpc(scope, "VPC");
        const dbCluster = new aws_docdb_1.DatabaseCluster(scope, "DocumentdbCluster", {
            storageEncrypted: true,
            vpcSubnets: {
                subnetType: aws_ec2_1.SubnetType.PRIVATE_WITH_NAT,
            },
            vpc: this.vpc,
            instanceType: aws_ec2_1.InstanceType.of(aws_ec2_1.InstanceClass.T3, aws_ec2_1.InstanceSize.MEDIUM),
            ...props,
        });
        this.dbCluster = dbCluster;
        const certificateLayer = new aws_lambda_1.LayerVersion(scope, "CertificateLayer", {
            code: aws_lambda_1.Code.fromAsset((0, path_1.join)(__dirname, "certificate"), {
                followSymlinks: aws_cdk_lib_1.SymlinkFollowMode.ALWAYS,
            }),
            layerVersionName: "CertificateLayer",
            description: "Documentdb certificate layer",
        });
        this.certificateLayer = certificateLayer;
    }
    allowCommunication(...lambdas) {
        lambdas.forEach((lambda) => {
            var _a;
            lambda.addLayers(this.certificateLayer);
            (_a = this.dbCluster.secret) === null || _a === void 0 ? void 0 : _a.grantRead(lambda);
            this.dbCluster.connections.allowFrom(lambda, aws_ec2_1.Port.tcp(27017), "Allow lambda communication with Documentdb cluster");
        });
    }
}
exports.DocumentdbClusterLambdaConnection = DocumentdbClusterLambdaConnection;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG9jdW1lbnRkYkxhbWJkYUNvbm5lY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvRG9jdW1lbnRkYkxhbWJkYUNvbm5lY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWdEO0FBQ2hELHFEQUE4RTtBQUM5RSxpREFTNkI7QUFFN0IsdURBQTJFO0FBQzNFLDJDQUF1QztBQUN2QywrQkFBNEI7QUFVNUIsTUFBYSxpQ0FBa0MsU0FBUSxzQkFBUztJQU05RCxZQUNFLEtBQWdCLEVBQ2hCLEVBQVUsRUFDVixLQUE2Qzs7UUFFN0MsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsR0FBRyxHQUFHLE1BQUEsS0FBSyxDQUFDLEdBQUcsbUNBQUksSUFBSSxhQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTlDLE1BQU0sU0FBUyxHQUFHLElBQUksMkJBQWUsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUU7WUFDaEUsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixVQUFVLEVBQUU7Z0JBQ1YsVUFBVSxFQUFFLG9CQUFVLENBQUMsZ0JBQWdCO2FBQ3hDO1lBQ0QsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsWUFBWSxFQUFFLHNCQUFZLENBQUMsRUFBRSxDQUFDLHVCQUFhLENBQUMsRUFBRSxFQUFFLHNCQUFZLENBQUMsTUFBTSxDQUFDO1lBQ3BFLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBRTNCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSx5QkFBWSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUNuRSxJQUFJLEVBQUUsaUJBQUksQ0FBQyxTQUFTLENBQUMsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLGFBQWEsQ0FBQyxFQUFFO2dCQUNuRCxjQUFjLEVBQUUsK0JBQWlCLENBQUMsTUFBTTthQUN6QyxDQUFDO1lBQ0YsZ0JBQWdCLEVBQUUsa0JBQWtCO1lBQ3BDLFdBQVcsRUFBRSw4QkFBOEI7U0FDNUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzNDLENBQUM7SUFFTSxrQkFBa0IsQ0FDdkIsR0FBRyxPQUNrRTtRQUVyRSxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7O1lBQ3pCLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDeEMsTUFBQSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sMENBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FDbEMsTUFBTSxFQUNOLGNBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQ2Ysb0RBQW9ELENBQ3JELENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWxERCw4RUFrREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTeW1saW5rRm9sbG93TW9kZSB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHsgRGF0YWJhc2VDbHVzdGVyLCBEYXRhYmFzZUNsdXN0ZXJQcm9wcyB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZG9jZGJcIjtcbmltcG9ydCB7XG4gIElDb25uZWN0YWJsZSxcbiAgSW5zdGFuY2VDbGFzcyxcbiAgSW5zdGFuY2VTaXplLFxuICBJbnN0YW5jZVR5cGUsXG4gIElWcGMsXG4gIFBvcnQsXG4gIFN1Ym5ldFR5cGUsXG4gIFZwYyxcbn0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1lYzJcIjtcbmltcG9ydCB7IElHcmFudGFibGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0IHsgQ29kZSwgSUxheWVyVmVyc2lvbiwgTGF5ZXJWZXJzaW9uIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sYW1iZGFcIjtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcblxudHlwZSBEb2N1bWVudGRiQ2x1c3RlckxhbWJkYUNvbm5lY3Rpb25Qcm9wcyA9IE9taXQ8XG4gIERhdGFiYXNlQ2x1c3RlclByb3BzLFxuICBcInZwY1wiIHwgXCJpbnN0YW5jZVR5cGVcIlxuPiAmIHtcbiAgdnBjPzogSVZwYztcbiAgaW5zdGFuY2VUeXBlPzogSW5zdGFuY2VUeXBlO1xufTtcblxuZXhwb3J0IGNsYXNzIERvY3VtZW50ZGJDbHVzdGVyTGFtYmRhQ29ubmVjdGlvbiBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHJlYWRvbmx5IHZwYzogSVZwYztcblxuICBwcml2YXRlIGNlcnRpZmljYXRlTGF5ZXI6IElMYXllclZlcnNpb247XG4gIHByaXZhdGUgZGJDbHVzdGVyOiBEYXRhYmFzZUNsdXN0ZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgc2NvcGU6IENvbnN0cnVjdCxcbiAgICBpZDogc3RyaW5nLFxuICAgIHByb3BzOiBEb2N1bWVudGRiQ2x1c3RlckxhbWJkYUNvbm5lY3Rpb25Qcm9wc1xuICApIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMudnBjID0gcHJvcHMudnBjID8/IG5ldyBWcGMoc2NvcGUsIFwiVlBDXCIpO1xuXG4gICAgY29uc3QgZGJDbHVzdGVyID0gbmV3IERhdGFiYXNlQ2x1c3RlcihzY29wZSwgXCJEb2N1bWVudGRiQ2x1c3RlclwiLCB7XG4gICAgICBzdG9yYWdlRW5jcnlwdGVkOiB0cnVlLFxuICAgICAgdnBjU3VibmV0czoge1xuICAgICAgICBzdWJuZXRUeXBlOiBTdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9OQVQsXG4gICAgICB9LFxuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIGluc3RhbmNlVHlwZTogSW5zdGFuY2VUeXBlLm9mKEluc3RhbmNlQ2xhc3MuVDMsIEluc3RhbmNlU2l6ZS5NRURJVU0pLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gICAgdGhpcy5kYkNsdXN0ZXIgPSBkYkNsdXN0ZXI7XG5cbiAgICBjb25zdCBjZXJ0aWZpY2F0ZUxheWVyID0gbmV3IExheWVyVmVyc2lvbihzY29wZSwgXCJDZXJ0aWZpY2F0ZUxheWVyXCIsIHtcbiAgICAgIGNvZGU6IENvZGUuZnJvbUFzc2V0KGpvaW4oX19kaXJuYW1lLCBcImNlcnRpZmljYXRlXCIpLCB7XG4gICAgICAgIGZvbGxvd1N5bWxpbmtzOiBTeW1saW5rRm9sbG93TW9kZS5BTFdBWVMsXG4gICAgICB9KSxcbiAgICAgIGxheWVyVmVyc2lvbk5hbWU6IFwiQ2VydGlmaWNhdGVMYXllclwiLFxuICAgICAgZGVzY3JpcHRpb246IFwiRG9jdW1lbnRkYiBjZXJ0aWZpY2F0ZSBsYXllclwiLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jZXJ0aWZpY2F0ZUxheWVyID0gY2VydGlmaWNhdGVMYXllcjtcbiAgfVxuXG4gIHB1YmxpYyBhbGxvd0NvbW11bmljYXRpb24oXG4gICAgLi4ubGFtYmRhczogKElDb25uZWN0YWJsZSAmXG4gICAgICBJR3JhbnRhYmxlICYgeyBhZGRMYXllcnM6ICguLi5sYXllcnM6IElMYXllclZlcnNpb25bXSkgPT4gdm9pZCB9KVtdXG4gICkge1xuICAgIGxhbWJkYXMuZm9yRWFjaCgobGFtYmRhKSA9PiB7XG4gICAgICBsYW1iZGEuYWRkTGF5ZXJzKHRoaXMuY2VydGlmaWNhdGVMYXllcik7XG4gICAgICB0aGlzLmRiQ2x1c3Rlci5zZWNyZXQ/LmdyYW50UmVhZChsYW1iZGEpO1xuICAgICAgdGhpcy5kYkNsdXN0ZXIuY29ubmVjdGlvbnMuYWxsb3dGcm9tKFxuICAgICAgICBsYW1iZGEsXG4gICAgICAgIFBvcnQudGNwKDI3MDE3KSxcbiAgICAgICAgXCJBbGxvdyBsYW1iZGEgY29tbXVuaWNhdGlvbiB3aXRoIERvY3VtZW50ZGIgY2x1c3RlclwiXG4gICAgICApO1xuICAgIH0pO1xuICB9XG59XG4iXX0=