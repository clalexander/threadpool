variable "vpc__cidr" {
  description = "The block for entire VPC. Use a /16 block"
  type = string
}

variable "vpc__private-subnets" {
  description = "All the private subnets for the VPC"
  type = map(object({
    availability_zone = string
    cidr_block = string
  }))
}

variable "vpc__public-subnets" {
  description = "All the public subnets for the VPC"
  type = map(object({
    availability_zone = string
    cidr_block = string
  }))
}

variable "inksoft__api-key-secret-id" {
  type = string
}

variable "inksoft__orders-sync-frequency" {
  type = number
  description = "Frequency in minutes"
}

variable "inksoft__orders-sync-min-start-time-param-id" {
  type = string
}

variable "inksoft__orders-sync-start-offset-param-id" {
  type = string
}

variable "printful__api-token-secret-id" {
  type = string
}
