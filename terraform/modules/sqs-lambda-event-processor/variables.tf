variable "service_name" {
  type = string
}

variable "service_env" {
  type = string
}

variable "service_visibility" {
  type = string
  default = "private"
}

variable "events_queue_visibility_timeout" {
  type = number
  default = 30
}

variable "events_queue_receive_count" {
  type = number
  default = 1
}

variable "events_queue_batch_size" {
  type = number
  default = 10
}

variable "events_queue_policy" {
  type = string
  default = null
}

variable "lambda_filename" {
  type = string
}

variable "lambda_handler" {
  type = string
}

variable "lambda_description" {
  type = string
  default = null
}

variable "lambda_env_vars" {
  type = map
  default = {}
}

variable "lambda_layers" {
  type = list(string)
  default = []
}

variable "lambda_execution_policies" {
  # type = list(object({
  #   name = string
  #   policy = string
  # }))
  type = list(string)
  default = []
}

variable "lambda_runtime" {
  type = string
  default = "nodejs16.x"
}

variable "lambda_memory_size" {
  type = number
  default = 128
}

variable "lambda_timeout" {
  type = number
  default = 3
}

variable "log_retention_period" {
  type = number
  default = 30
}

variable "vpc_id" {
  type = string
  default = null
}

variable "vpc_subnet_ids" {
  type = list(string)
  default = []
}

variable "tags" {
  type = map
  default = {}
}
