data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "template_file" "execution-policy" {
  template = file("${path.module}/policies/execution-policy.json")
  vars = {
    AWS_REGION = data.aws_region.current.name
    AWS_ACCOUNT = data.aws_caller_identity.current.account_id
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
    SUMMARY_EVENTS_TABLE_NAME = var.summary_events_table_name
    SNS_EMAIL_NOTIFICATIONS_ARN = var.sns_email_notifications_arn
  }
}

module "service" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "Threadpool_DailySummary"
  handler = "index.handler"
  runtime = "nodejs16.x"
  timeout = 10

  environment_variables = {
    SERVICE_ENV = var.service_env
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
    SUMMARY_EVENTS_TABLE_NAME = var.summary_events_table_name
    SNS_EMAIL_NOTIFICATIONS_ARN = var.sns_email_notifications_arn
  }
  
  create_package = false
  local_existing_package =  "${var.packages_dir}/daily-summary.zip"

  # vpc_subnet_ids = var.vpc_subnet_ids
  # vpc_security_group_ids = var.vpc_security_group_ids

  attach_policy_json = true
  policy_json = data.template_file.execution-policy.rendered

  cloudwatch_logs_retention_in_days = 30

  create_current_version_allowed_triggers = false
  allowed_triggers = {
    CronTriggerRule = {
      principal = "events.amazonaws.com"
      source_arn = var.eventbridge_rule_arn
    }
  }
  
}
