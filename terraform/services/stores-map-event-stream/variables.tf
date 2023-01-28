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

variable "target_eventbridge_arn" {
  type = string
}

variable "stores_map_table_name" {
  type = string
}

variable "stores_map_table_stream_arn" {
  type = string
}

variable "packages_dir" {
  type = string
}
