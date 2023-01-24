data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

module "api_gateway" {
  source = "terraform-aws-modules/apigateway-v2/aws"

  name = "Threadpool_Printful_Webhook"
  description = "Printful webhook api gateway for Threadpool"
  protocol_type = "HTTP"

  create_api_domain_name = false

  integrations = {

    "POST /webhook" = {
      lambda_arn = module.service.lambda_function_arn
      payload_format_version = "2.0"
    }

  }
}

data "template_file" "execution-policy" {
  template = file("${path.module}/policies/execution-policy.json")
  vars = {
    AWS_REGION = data.aws_region.current.name
    AWS_ACCOUNT = data.aws_caller_identity.current.account_id
    WEBHOOK_TOKEN_SECRET_ID = var.webhook_token_secret_id
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
  }
}

module "service" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "Threadpool_Printful_Webhook"
  handler = "index.handler"
  runtime = "nodejs16.x"
  timeout = 10

  environment_variables = {
    SERVICE_ENV = var.service_env
    WEBHOOK_TOKEN_SECRET_ID = var.webhook_token_secret_id
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
  }
  
  create_package = false
  local_existing_package = "${var.packages_dir}/printful-webhook.zip"

  # vpc_subnet_ids = var.vpc_subnet_ids
  # vpc_security_group_ids = var.vpc_security_group_ids

  attach_policy_json = true
  policy_json = data.template_file.execution-policy.rendered

  cloudwatch_logs_retention_in_days = 30

  create_current_version_allowed_triggers = false
  allowed_triggers = {
    AllowExecutionFromAPIGateway = {
      service = "apigateway"
      source_arn = "${module.api_gateway.apigatewayv2_api_execution_arn}/*/*"
    }
  }
  
}
