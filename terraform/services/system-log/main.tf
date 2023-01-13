resource "aws_cloudwatch_log_group" "this" {
  name = "/aws/events/Threadpool"
  retention_in_days = 30
}

data "template_file" "log-policy" {
  template = file("${path.module}/policies/log-policy.json")
  vars = {
    CLOUDWATCH_LOG_GROUP_ARN = aws_cloudwatch_log_group.this.arn
    EVENTBRIDGE_RULE_ARN = var.eventbridge_rule_arn
  }
}

resource "aws_cloudwatch_log_resource_policy" "this" {
  policy_document = data.template_file.log-policy.rendered
  policy_name     = "threadpool-events-log-group-policy"
}


data "aws_iam_policy_document" "example_log_policy" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream"
    ]

    resources = [
      "${aws_cloudwatch_log_group.this.arn}:*"
    ]

    principals {
      type = "Service"
      identifiers = [
        "events.amazonaws.com"
      ]
    }
  }
  statement {
    effect = "Allow"
    actions = [
      "logs:PutLogEvents"
    ]

    resources = [
      "${aws_cloudwatch_log_group.this.arn}:*:*"
    ]

    principals {
      type = "Service"
      identifiers = [
        "events.amazonaws.com"
      ]
    }

    condition {
      test     = "ArnEquals"
      values   = [var.eventbridge_rule_arn]
      variable = "aws:SourceArn"
    }
  }
}