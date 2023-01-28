# Threadpool

Threadpool connects InkSoft and Printful with a streaming backend on AWS.

## Environment

- OS: Linux, unix or wsl
- Required: `npm`, `terraform`, `aws-cli`, `jq`
- Suggested: `direnv`

### Setup

Add `/bin` to `PATH`:

`.envrc` (with `direnv`)
```
PATH=$PWD/bin:$PATH
```

### Allowed Environments

- `dev`
- `stage`
- `production`

## Build Service Code

```
npm run build
```

To build a single service:

```
npm run build -- --only <service_name>
```

Source code deployment packages are saved to `/dist`.

** Note: Rollup might run out of memory during the build process.  Build the remaining packages individually.

## Configuration

### Secrets

Create a secret in AWS Secrets Manager for each of the following:

Your InkSoft and Printful API keys/tokens:

- `prod/InkSoft/ApiKey`
- `prod/Printful/ApiAccessToken`

A cryptographic token for the Printful webhook:

- `prod/Printful/WebhookToken`

### Parameters

Create the following parameters in AWS Systems Manager:

| **Parameter**                | **Value**    | **Description**                                                                                    |
|------------------------------|--------------|----------------------------------------------------------------------------------------------------|
| `/prod/InkSoft/baseURL` | `<url>` | Base URL for InkSoft store               |
| `/prod/InkSoft/minStartTime` | `1672549200` | Unix timestamp for the earliest start date for fetching order summaries from InkSoft               |
| `/prod/InkSoft/startOffset`  | `5`          | Time in seconds to overlap start/end date ranges on consecutive order summary fetches from InkSoft |
| `/prod/SummaryEvents/ttl`    | `604800`     | TTL time in seconds for summary events, must be greater than one day                               |

## Deployment

### Deploy Terraform Backend

Deploy the Terraform backend using the CloudFormation template at `stacks/terraform-backend.yml`.  

### Create Environment Variables

Create a `.env` and/or `.env.<environment>` file(s) in the `terraform` directory containing the following variables:

| **Variable**            | **Value**                                     | **Notes**                                                 |
|-------------------------|-----------------------------------------------|-----------------------------------------------------------|
| AWS_ACCOUNT             | [aws-account-number]                          |                                                           |
| AWS_PROFILE             | [aws-credentials-profile]                     | Profile for aws account                                   |
| AWS_REGION              | [aws-region-name]
| AWS_DEFAULT_REGION      | [aws-region-name]                             |                                                           |
| APPLICATION             | threadpool                                      |                                                         |
| SHARED_CREDENTIALS_FILE | $HOME/.aws/credentials                        | Location of aws credentials file for Terraform S3 backend |
| REMOTE_STATE_BUCKET     | com.$AWS_ACCOUNT.$AWS_REGION.[backend-bucket] | Parameter from Terraform backend CloudFormation template  |
| REMOTE_STATE_LOCK       | [table-name]                                  | Parameter from Terraform backend CloudFormation template  |

### Create Terraform Variables

Create a `<environment>.tfvars` file in the `terraform` directory using values from the above configuration:

`<environment>.tfvars`
```terraform
inksoft__api-key-secret-id = "<secret-id>"
inksoft__orders-sync-frequency = <frequency-minutes>
inksoft__orders-sync-min-start-time-param-id = "<param-id>"
inksoft__orders-sync-start-offset-param-id =  "<param-id>"
printful__api-token-secret-id = "<secret-id>"
printful-webhook__token-secret-id = "<secret-id>"
summary-event__event-ttl-param-id = "<param-id>"
```

**NOTE: Parameter ids must start with `'/'`**

### Deploy Infrastructure

To deploy the infrastructure:

```bash
cd terraform
tf init -e <environment> # needs to be done only once per environment
tf apply -e <environment>
```

### Configure Stores Map

Navigate in the AWS Console to the DynamoDB table `Threadpool_Stores_Map`, click the 'Explore table items' button, and click the 'Create item' button.

Add an entry for each InkSoft/Printful store pair:

```typescript
inksoft_store_id: number // InkSoft store id
printful_store_id: number // Printful store id
name: string // Name of store(s) (optional)
```

### Add Emails to Email Notifications SNS Topic

Create subscriptions to the AWS SNS `Threadpool_EmailNotifications` topic to receive email notifications like the daily summary.

## Update Configuration

To update a secret or parameter, navigate to AWS Secrets Manager or AWS Systems Manager respectively in the AWS console and change the value.  Updates will take up to 15 minutes to take effect.

## Take Down Threadpool

### Take Down Infrastructure

To take down the infrastructure and shut down Threadpool:

```bash
cd terraform
tf destroy -e <environment>
```

### Delete Terraform Backend

Delete the AWS CloudFormation Terraform backend stack.

## Terraform `tf` Utility

Use this utility, and only this utility, to manage the infrastructure in aws.

### Usage

```
Usage: tf <command> [args] [options]

Main commands:
  init                      Prepare your working directory for other commands
  plan                      Show changes required by the current configuration
  apply                     Create or update infrastructure
  destroy                   Destroy previously-create infrastructure

Remote variable commands:
  get-vars                  Lists all remote vars
  get-var <name>            Fetches the value of a remote variable
  set-var <name> <value>    Sets the value of a remote variable, value can
                            be in "quotes" to include spaces
  del-var <name>            Deletes a remote variable
  clear-vars                Deletes all remote variables

Other commands:
  refresh                   Updates the state to match remote systems

Options:
  [-e | --env | --environment] <env>    Specifies the environment,
                                        can be stage | prod (* required)
  [-r | --region] <region>              Specifies the aws region, must be a 
                                        valid region, defaults to the AWS
                                        default region environment variable
  [-p | --profile] <profile>            AWS CLI profile, defaults to synaptech
  [-tfv | --tfv] <name> <value>         Sets a terraform variable
  [-d | --distinct]                     Applies command to all distinct resources
  [-s | --shared]                       Applies command to all shared resources
  [-R | --recursive]                    Applies command recursively
  [-a | --auto-approve]                 Auto approves commands
```

### `.config`

The `.config` json file in the resource workspace specifies properties such as the environment `environment`, terraform state keypath `tfStateKeypath` and remote variables `remoteVars`.

Example:

```
{
  "environment": "shared",
  "tfStateKeypath": "devops/ecr/service",
  "remoteVars": [
    "variable_name"
  ]
}
```

### Terraform State Keypath

The default keypath for terraform state is the folder path to the workspace from the closest parent `terraform` folder.

For example, if the workspace path is `~/projects/service/terraform/infra/resource`, then the keypath will be `infra/resource`.

Sometimes this default keypath is not sufficient.  You can set the keypath by setting the `tfStateKeypath` value in the `.config` file.

### Remote Variables

This utility allows the storage of remote variables that are automatically passed to terraform during terraform operations.

The purpose of these vars are so terraform and infrastructure can be managed from multiple workstations while using terraform variables whose consitency and persistence matters.  Setting a remote variable at one workstation makes it available from another automatically.

### Shared and Distinct Resources

Different infrastructure resource are managed in their own separate workspaces.  Some of the resources are shared between environments, however most are distinct for each environment.

This utility provides the ability to apply commands to each group of resources at the same time.  This allows for individual resource management as well as easier management of an entire environment.

Shared and distinct resources are configured in a parent directory in a file `tfconfig.json` containing lists of relative paths to each resource's terraform workspace.

Example `tfconfig.json`:
```
{
  "shared": [
    "path/to/shared/resource"
  ],
  "distinct": [
    "path/to/distinct/resource",
    "path/to-anoather/distinct/resource"
  ]
}
```
