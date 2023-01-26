locals {
  public_cidr_block = "0.0.0.0/0"
  public_cidr_block_v6 = "::/0"
  private_cidr_blocks = "0.0.0.0/0"
  private_cidr_block_v6 = "::/0"
  tags = {
    Name = "${var.service_name}--${var.service_env}"
    service-name = var.service_name
    service-env = var.service_env
    service-type = "network"
    service-visibility = "internal"
  }
}