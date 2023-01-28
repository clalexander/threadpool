variable "service_env" {
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

variable "webhook_token_secret_id" {
  type = string
}

variable "target_eventbridge_arn" {
  type = string
}

variable "packages_dir" {
  type = string
}
