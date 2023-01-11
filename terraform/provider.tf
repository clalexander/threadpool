variable "aws_region" {}
variable "aws_profile" {}
variable "remote_state_bucket" {}
variable "remote_state_key" {}
variable "remote_state_lock" {}
variable "shared_credentials_file" {}

terraform {
  required_version = ">= 1.3"

  required_providers {
    aws = ">= 4.49"
  }

  backend "s3" {
    region = var.aws_region
    bucket = var.remote_state_bucket
    key = var.remote_state_key
    dynamodb_table = var.remote_state_lock
    profile = var.aws_profile
    shared_credentials_file = var.shared_credentials_file
  }
}

provider "aws" {
  region = var.aws_region
}