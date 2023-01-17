data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

data "template_file" "execution_policy" {
  template = file("${path.module}/policies/execution-policy.json")
  vars = {
    AWS_ACCOUNT = data.aws_caller_identity.current.account_id
    AWS_REGION = data.aws_region.current.name
    TABLE_NAME = var.inksoft_order_table_name
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
    INKSOFT_API_KEY_SECRET_ID = var.inksoft_api_key_secret_id
  }
}

module "event-processor" {
  source = "../../modules/sqs-lambda-event-processor"

  service_env = var.service_env
  service_name = "Threadpool_InkSoft_OrderSummaryTranslator"

  lambda_filename =  "${var.packages_dir}/inksoft-order-summary-translator.zip"
  lambda_handler = "index.handler"
  lambda_timeout = 10

  lambda_execution_policies = [data.template_file.execution_policy.rendered]

  lambda_env_vars = {
    SERVICE_ENV = var.service_env
    API_KEY_SECRET_ID = var.inksoft_api_key_secret_id
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
    TABLE_NAME = var.inksoft_order_table_name
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
