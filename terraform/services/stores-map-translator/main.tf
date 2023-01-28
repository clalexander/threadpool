data "template_file" "execution_policy" {
  template = file("${path.module}/policies/execution-policy.json")
  vars = {
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
  }
}

module "event-processor" {
  source = "../../modules/sqs-lambda-event-processor"

  service_env = var.service_env
  service_name = "Threadpool_StoresMap_Translator"

  lambda_filename =  "${var.packages_dir}/stores-map-translator.zip"
  lambda_handler = "index.handler"
  lambda_timeout = 10

  lambda_execution_policies = [data.template_file.execution_policy.rendered]

  lambda_env_vars = {
    SERVICE_ENV = var.service_env
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
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
