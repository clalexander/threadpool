data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

locals {
  is_prod = var.service_env == "production"
}

resource "aws_s3_bucket" "this" {
  bucket = "com.threadpool.${data.aws_region.current.name}.${var.service_env}.inksoft-orders-sync"
  force_destroy = !local.is_prod

  tags = {
    Name = "State bucket for InkSoft Order Sync: ${var.service_env}"
    service-name = "swypeless-s3"
    service-env = var.service_env
    service-type = "storage"
    service-visibility = "internal"
  }
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.this.id
  acl = "private"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

data "template_file" "execution-policy" {
  template = file("${path.module}/policies/lambda-execution-policy.json")
  vars = {
    AWS_REGION = data.aws_region.current.name
    AWS_ACCOUNT = data.aws_caller_identity.current.account_id
    INKSOFT_API_BASE_URL_PARAM_ID = var.inksoft_api_base_url_param_id
    INKSOFT_API_KEY_SECRET_ID = var.inksoft_api_key_secret_id
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
    BUCKET_NAME = aws_s3_bucket.this.id
    MIN_START_TIME_PARAM_ID = var.min_start_time_param_id
    START_OFFSET_PARAM_ID = var.start_offset_param_id
  }
}

module "service" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "Threadpool_InkSoft_OrdersSync"
  handler = "index.handler"
  runtime = "nodejs16.x"
  timeout = 10

  environment_variables = {
    SERVICE_ENV = var.service_env
    INKSOFT_API_BASE_URL_PARAM_ID = var.inksoft_api_base_url_param_id
    INKSOFT_API_KEY_SECRET_ID = var.inksoft_api_key_secret_id
    TARGET_EVENTBRIDGE_ARN = var.target_eventbridge_arn
    BUCKET_NAME = aws_s3_bucket.this.id
    MIN_START_TIME_PARAM_ID = var.min_start_time_param_id
    START_OFFSET_PARAM_ID = var.start_offset_param_id
  }
  
  create_package = false
  local_existing_package =  "${var.packages_dir}/inksoft-orders-sync.zip"

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
