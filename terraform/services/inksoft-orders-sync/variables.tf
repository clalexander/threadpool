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

variable "eventbridge_rule_arn" {
  type = string
}

variable "target_eventbridge_arn" {
  type = string
}

variable "packages_dir" {
  type = string
}

variable "inksoft_api_key_secret_id" {
  type = string
}

variable "min_start_time_param_id" {
  type = string
}

variable "start_offset_param_id" {
  type = string
}
