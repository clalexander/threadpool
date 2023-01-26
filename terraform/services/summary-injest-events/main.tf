data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

data "template_file" "execution_policy" {
  template = file("${path.module}/policies/execution-policy.json")
  vars = {
    AWS_ACCOUNT = data.aws_caller_identity.current.account_id
    AWS_REGION = data.aws_region.current.name
    SUMMARY_EVENTS_TABLE_NAME = var.summary_events_table_name
    EVENT_TTL_PARAM_ID = var.event_ttl_param_id
  }
}

module "event-processor" {
  source = "../../modules/sqs-lambda-event-processor"

  service_env = var.service_env
  service_name = "Threadpool_Summary_InjestEvents"

  lambda_filename =  "${var.packages_dir}/summary-injest-events.zip"
  lambda_handler = "index.handler"
  lambda_timeout = 10

  lambda_execution_policies = [data.template_file.execution_policy.rendered]

  lambda_env_vars = {
    SUMMARY_EVENTS_TABLE_NAME = var.summary_events_table_name
    EVENT_TTL_PARAM_ID = var.event_ttl_param_id
  }
}

data "template_file" "events_queue_policy" {
  template = file("${path.module}/policies/events-queue-policy.json")
  vars = {
    EVENTS_QUEUE_ARN = module.event-processor.events_queue.arn
    EVENTBRIDGE_ARN = var.eventbridge_rule_arn
  }
}

resource "aws_sqs_queue_policy" "events" {
  queue_url = module.event-processor.events_queue.url
  policy = data.template_file.events_queue_policy.rendered
}
