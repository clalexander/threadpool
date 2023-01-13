locals {
  deadletter_sqs_name = "${var.service_name}__deadletter"
  default_env_vars = {
    SERVICE_ENV = var.service_env
  }
  env_vars = merge(local.default_env_vars, var.lambda_env_vars)
  default_tags = {
    Name = var.service_name
    service-name = var.service_name
    service-visibility = var.service_visibility
    service-env = var.service_env
  }
  tags = merge(local.default_tags, var.tags)
}

resource "aws_sqs_queue" "events" {
  name = var.service_name
  
  policy = var.events_queue_policy

  visibility_timeout_seconds = var.events_queue_visibility_timeout

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.deadletter.arn
    maxReceiveCount = var.events_queue_retry_count
  })

  tags = local.tags
}

resource "aws_sqs_queue" "deadletter" {
  name = local.deadletter_sqs_name

  tags = local.tags
}

data "template_file" "execution_policy" {
  template = file("${path.module}/policies/lambda-execution-policy.json")
  vars = {
    EVENTS_QUEUE_ARN = aws_sqs_queue.events.arn
    DEADLETTER_QUEUE_ARN = aws_sqs_queue.deadletter.arn
  }
}

module "service" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = var.service_name
  description = var.lambda_description
  
  create_package = false
  local_existing_package = var.lambda_filename
  handler = var.lambda_handler
  layers = var.lambda_layers
  environment_variables = local.env_vars

  runtime = var.lambda_runtime
  memory_size = var.lambda_memory_size
  timeout = var.lambda_timeout

  attach_dead_letter_policy = true
  dead_letter_target_arn = aws_sqs_queue.deadletter.arn

  # vpc_subnet_ids = var.vpc_subnet_ids
  # vpc_security_group_ids = var.vpc_security_group_ids

  attach_policy_json = true
  policy_json = data.template_file.execution_policy.rendered

  attach_policy_jsons = true
  policy_jsons = var.lambda_execution_policies

  cloudwatch_logs_retention_in_days = var.log_retention_period

  event_source_mapping = {
    sqs = {
      event_source_arn = aws_sqs_queue.events.arn
      batch_size = var.events_queue_batch_size
      function_response_types = [
        "ReportBatchItemFailures"
      ]
    }
  }

  tags = var.tags
  
}
