resource "aws_vpc" "this" {
  cidr_block = var.vpc__cidr
  assign_generated_ipv6_cidr_block = false
  enable_dns_hostnames = true
  enable_dns_support = true

  tags = local.tags
}

resource "aws_default_security_group" "this" {
  vpc_id = aws_vpc.this.id
  tags = local.tags
  egress {
    protocol = -1
    from_port = 0
    to_port = 0
    cidr_blocks = [
      local.public_cidr_block
    ]
  }
  egress {
    protocol = -1
    from_port = 0
    to_port = 0
    ipv6_cidr_blocks = [
      local.public_cidr_block_v6
    ]
  }
  ingress {
    from_port = 22
    protocol = "tcp"
    to_port = 22
    cidr_blocks = [
      aws_vpc.this.cidr_block
    ]
  }
}

resource "aws_default_network_acl" "this" {
  default_network_acl_id = aws_vpc.this.default_network_acl_id

  subnet_ids = concat(values(aws_subnet.public)[*]["id"], values(aws_subnet.private)[*]["id"])
  tags = local.tags

  egress {
    // Don't restrict egress
    action = "allow"
    rule_no = 1
    from_port = 0
    protocol = -1
    to_port = 0
    cidr_block = local.public_cidr_block
  }
  egress {
    // Don't restrict egress
    action = "allow"
    rule_no = 2
    from_port = 0
    protocol = -1
    to_port = 0
    ipv6_cidr_block = local.public_cidr_block_v6
  }

  // * Many Linux kernels (including the Amazon Linux kernel) use ports 32768-61000.
  // * Requests originating from Elastic Load Balancing use ports 1024-65535.
  // * Windows operating systems through Windows Server 2003 use ports 1025-5000.
  // * Windows Server 2008 and later versions use ports 49152-65535.
  // * A NAT gateway uses ports 1024-65535.
  // * AWS Lambda functions use ports 1024-65535
  //
  // https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html#nacl-ephemeral-ports
  ingress {
    // NAT Gateway ephemeral ports
    rule_no = 13
    action = "allow"
    protocol = "tcp"
    from_port = 1024
    to_port = 65535
    cidr_block = local.public_cidr_block
  }
  ingress {
    // NAT Gateway ephemeral ports
    rule_no = 14
    action = "allow"
    protocol = "udp"
    from_port = 1024
    to_port = 65535
    cidr_block = local.public_cidr_block
  }

  ingress {
    // By default don't allow any ingress
    rule_no = 30000
    action = "deny"
    protocol = -1
    from_port = 0
    to_port = 0
    cidr_block = local.public_cidr_block
  }
  ingress {
    // By default don't allow any ingress
    rule_no = 30001
    action = "deny"
    protocol = -1
    from_port = 0
    to_port = 0
    ipv6_cidr_block = local.public_cidr_block_v6
  }

  // 500 Public Access
  ingress {
    // Allow SSH without a jumphost for now
    rule_no = 500
    action = "allow"
    protocol = "tcp"
    from_port = 22
    to_port = 22
    cidr_block = local.public_cidr_block
  }
  ingress {
    // Allow HTTP traffic
    rule_no = 501
    action = "allow"
    protocol = "tcp"
    from_port = 80
    to_port = 80
    cidr_block = local.public_cidr_block
  }
  ingress {
    // Allow HTTPS traffic
    rule_no = 502
    action = "allow"
    protocol = "tcp"
    from_port = 443
    to_port = 443
    cidr_block = local.public_cidr_block
  }

  // 1xx Internal access
  ingress {
    // Allow all ports/protocols within this VPC
    rule_no = 100
    action = "allow"
    protocol = -1
    cidr_block = aws_vpc.this.cidr_block
    from_port = 0
    to_port = 0
  }
}


// -----------------------------------------------------------------------------
// Subnets
// -----------------------------------------------------------------------------

resource "aws_subnet" "private" {
  // Subnets for most things that shouldn't be accessed directly. Anything
  // that can be put behind a load balancer should go in a private subnet.
  for_each = var.vpc__private-subnets
  vpc_id = aws_vpc.this.id
  cidr_block = each.value["cidr_block"]
  availability_zone = each.value["availability_zone"]
  tags = merge(local.tags, {
    Name = "${var.service_name}-private__${each.key}--${var.service_env}"
    service-visibility = "private"
  })
}

resource "aws_subnet" "public" {
  // Subnets for Load balancer and services that can't be put behind a Load
  // balancer like FTP
  for_each = var.vpc__public-subnets
  vpc_id = aws_vpc.this.id
  cidr_block = each.value["cidr_block"]
  availability_zone = each.value["availability_zone"]
  tags = merge(local.tags, {
    Name = "${var.service_name}-public__${each.key}--${var.service_env}"
    service-visibility = "public"
  })
}


// -----------------------------------------------------------------------------
// Gateways
// -----------------------------------------------------------------------------

resource "aws_internet_gateway" "this" {
  vpc_id = aws_vpc.this.id
  tags = merge(local.tags, {
    Name = "${var.service_name}__IG--${var.service_env}"
  })
}

# resource "aws_eip" "this" {
#   vpc = true
#   depends_on = [
#     aws_internet_gateway.this
#   ]

#   tags = merge(local.tags, {
#     Name = "${var.service_name}__NAT-EIP--${var.service_env}"
#   })
# }

# resource "aws_nat_gateway" "this" {
#   // Only run the NAT gateway on 1 zone to save costs $0.045/hr : (24 x 30 x 0.045) x 2 = 64.8
#   allocation_id = aws_eip.nat.id
#   subnet_id = values(aws_subnet.public)[0]["id"]
#   tags = merge(local.tags, {
#     Name = "${var.service_name}__NAT--${var.service_env}"
#   })
# }


// -----------------------------------------------------------------------------
// Routing
// -----------------------------------------------------------------------------

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.this.id

  tags = merge(local.tags, {
    Name = "${var.service_name}__public--${var.service_env}"
  })

  route {
    cidr_block = local.public_cidr_block
    gateway_id = aws_internet_gateway.this.id
  }

  route {
    ipv6_cidr_block = local.public_cidr_block_v6
    gateway_id = aws_internet_gateway.this.id
  }
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public
  route_table_id = aws_route_table.public.id
  subnet_id = each.value["id"]
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.this.id
  tags = merge(local.tags, {
    Name = "${var.service_name}__private--${var.service_env}"
  })

  # route {
  #   // Egress in the private subnet goes through the NAT Gateway
  #   // Only IPv4 addresses are supported on NAT Gateway
  #   cidr_block = local.public_cidr_block
  #   nat_gateway_id = aws_nat_gateway.this.id
  # }

}

resource "aws_route_table_association" "private" {
  for_each = aws_subnet.private
  route_table_id = aws_route_table.private.id
  subnet_id = each.value["id"]
}

// -----------------------------------------------------------------------------
// Security
// -----------------------------------------------------------------------------

resource "aws_security_group" "public" {
  name = "PublicSecruityGroup"
  vpc_id = aws_vpc.this.id

  egress {
    description = "Allow any external access needed"
    protocol = -1
    from_port = 0
    to_port = 0
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    ipv6_cidr_blocks = [
      "::/0"
    ]
  }

  lifecycle {
    create_before_destroy = true
  }
}

// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------

data "aws_subnets" "public" {
  filter {
    name = "vpc-id"
    values = [aws_vpc.this.id]
  }
  filter {
    name = "tag:service-visibility"
    values = ["public"]
  }
}

data "aws_subnets" "private" {
  filter {
    name = "vpc-id"
    values = [aws_vpc.this.id]
  }
  filter {
    name = "tag:service-visibility"
    values = ["private"]
  }
}

