data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "template_file" "execution-policy" {
  template = file("${path.module}/policies/execution-policy.json")
  vars = {
    AWS_REGION = data.aws_region.current.name
    AWS_ACCOUNT = data.aws_caller_identity.current.account_id
    STORES_MAP_TABLE_NAME = var.stores_map_table_name
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
  }
}

module "service" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "Threadpool_StoresMap_EventStream"
  handler = "index.handler"
  runtime = "nodejs16.x"
  timeout = 10

  environment_variables = {
    SERVICE_ENV = var.service_env
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
  }
  
  create_package = false
  local_existing_package = "${var.packages_dir}/stores-map-event-stream.zip"

  # vpc_subnet_ids = var.vpc_subnet_ids
  # vpc_security_group_ids = var.vpc_security_group_ids

  attach_policy_json = true
  policy_json = data.template_file.execution-policy.rendered

  cloudwatch_logs_retention_in_days = 30

  event_source_mapping = {
    dynamodb = {
      event_source_arn: var.stores_map_table_stream_arn
      starting_position = "LATEST"
    }
  }
  
}
