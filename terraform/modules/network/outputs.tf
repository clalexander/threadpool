output "vpc__id" {
  value = aws_vpc.this.id
}

# output "vpc__private-subnets" {
#   value = [
#   for cidr, id in zipmap(
#   sort(values(var.vpc__private-subnets)[*]["cidr_block"]),
#   sort(values(aws_subnet.private)[*]["id"])) :
#   tomap({"cidr_block" = cidr, "id" = id})
#   ]
# }

# output "vpc__public-subnets" {
#   value = [
#   for cidr, id in zipmap(
#   sort(values(var.vpc__public-subnets)[*]["cidr_block"]),
#   sort(values(aws_subnet.public)[*]["id"])) :
#   tomap({"cidr_block" = cidr, "id" = id})
#   ]
# }

output "vpc__private-subnets" {
  value = data.aws_subnets.private
}

output "vpc__public-subnets" {
  value = data.aws_subnets.public
}

output "vpc__public-secruity-group" {
  value = aws_security_group.public
}
