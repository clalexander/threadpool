data "aws_region" "current" {}

locals {
  is_prod = var.service_env == "production"
}

resource "aws_s3_bucket" "data_lake" {
  bucket = "com.threadpool.${data.aws_region.current.name}.${var.service_env}.system-events"
  force_destroy = !local.is_prod

  tags = {
    Name = "System events data lake: ${var.service_env}"
    service-name = "swypeless-s3"
    service-env = var.service_env
    service-type = "storage"
    service-visibility = "internal"
  }
}

resource "aws_s3_bucket_acl" "this" {
  bucket = aws_s3_bucket.data_lake.id
  acl = "private"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.data_lake.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.data_lake.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_intelligent_tiering_configuration" "this" {
  bucket = aws_s3_bucket.data_lake.bucket
  name   = "EntireBucket"

  tiering {
    access_tier = "ARCHIVE_ACCESS"
    days        = 90
  }

  tiering {
    access_tier = "DEEP_ARCHIVE_ACCESS"
    days        = 180
  }
}

data "template_file" "data_lake_write_policy" {
  template = file("${path.module}/policies/data-lake-write-policy.json")
  vars = {
    BUCKET_NAME = aws_s3_bucket.data_lake.id
  }
}

module "event-processor" {
  source = "../../modules/sqs-lambda-event-processor"

  service_env = var.service_env
  service_name = "Threadpool_DataLake_InjestEvents"

  lambda_filename =  "${var.packages_dir}/data-lake-injest-events.zip"
  lambda_handler = "index.handler"
  lambda_timeout = 10

  lambda_execution_policies = [data.template_file.data_lake_write_policy.rendered]

  lambda_env_vars = {
    BUCKET_NAME = aws_s3_bucket.data_lake.bucket
    LOG_EVENTS = !local.is_prod
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
