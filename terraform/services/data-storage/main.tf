resource "aws_dynamodb_table" "inksoft_orders" {
  name = "InkSoft_Orders"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "StoreId"
  range_key = "ID"

  attribute {
    name = "StoreId"
    type = "N"
  }

  attribute {
    name = "ID"
    type = "N"
  }
}
