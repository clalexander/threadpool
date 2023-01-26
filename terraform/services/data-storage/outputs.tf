output "inksoft_orders_table" {
  value = aws_dynamodb_table.inksoft_orders
}

output "printful_orders_table" {
  value = aws_dynamodb_table.printful_orders
}

output "stores_map_table" {
  value = aws_dynamodb_table.stores_map
}

output "summary_events_table" {
  value = aws_dynamodb_table.summary_events
}
