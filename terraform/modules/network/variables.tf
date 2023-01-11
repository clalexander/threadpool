variable "service_name" {
  type = string
}

variable "service_env" {
  type = string
}

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
