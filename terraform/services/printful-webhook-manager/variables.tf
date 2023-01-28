variable "service_env" {
  type = string
}

variable "packages_dir" {
  type = string
}
# variable "vpc_subnet_ids" {
#   type = list(string)
#   default = []
# }

# variable "vpc_security_group_ids" {
#   type = list(string)
#   default = []
# }

variable "printful_api_token_secret_id" {
  type = string
}

variable "printful_webhook_url" {
  type = string
}

variable "printful_webhook_token_secret_id" {
  type = string
}

variable "eventbridge_rule_arn" {
  type = string
}

variable "target_eventbridge_arn" {
  type = string
}
