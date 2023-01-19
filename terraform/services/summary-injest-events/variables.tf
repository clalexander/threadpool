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

variable "summary_events_table_name" {
  type = string
}

variable "packages_dir" {
  type = string
}
