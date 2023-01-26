vpc__cidr = "10.8.0.0/16" // 10.8.0.0/12 project range
vpc__private-subnets = {
  zone-a = {
    availability_zone = "us-east-1a"
    cidr_block = "10.8.0.0/20"
  },
  zone-b = {
    availability_zone = "us-east-1b"
    cidr_block = "10.8.16.0/20"
  }
  zone-c = {
    availability_zone = "us-east-1c"
    cidr_block = "10.8.32.0/20"
  }
  zone-d = {
    availability_zone = "us-east-1d"
    cidr_block = "10.8.48.0/20"
  }
  zone-e = {
    availability_zone = "us-east-1e"
    cidr_block = "10.8.64.0/20"
  }
  zone-f = {
    availability_zone = "us-east-1f"
    cidr_block = "10.8.80.0/20"
  }
}
vpc__public-subnets = {
  zone-a = {
    availability_zone = "us-east-1a"
    cidr_block = "10.8.96.0/20"
  },
  zone-b = {
    availability_zone = "us-east-1b"
    cidr_block = "10.8.112.0/20"
  }
  zone-c = {
    availability_zone = "us-east-1c"
    cidr_block = "10.8.128.0/20"
  }
  zone-d = {
    availability_zone = "us-east-1d"
    cidr_block = "10.8.144.0/20"
  }
  zone-e = {
    availability_zone = "us-east-1e"
    cidr_block = "10.8.160.0/20"
  }
  zone-f = {
    availability_zone = "us-east-1f"
    cidr_block = "10.8.176.0/20"
  }
}