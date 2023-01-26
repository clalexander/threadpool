resource "aws_dynamodb_table" "inksoft_orders" {
  name = "Threadpool_InkSoft_Orders"
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

  attribute {
    name = "UniqueId"
    type = "S"
  }

  global_secondary_index {
    name = "UniqueId"
    hash_key = "UniqueId"
    projection_type = "KEYS_ONLY"
  }
}

resource "aws_dynamodb_table" "printful_orders" {
  name = "Threadpool_Printful_Orders"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "store"
  range_key = "id"

  attribute {
    name = "store"
    type = "N"
  }

  attribute {
    name = "id"
    type = "N"
  }

  attribute {
    name = "external_id"
    type = "S"
  }

  global_secondary_index {
    name = "ExternalId"
    hash_key = "external_id"
    projection_type = "KEYS_ONLY"
  }
}

resource "aws_dynamodb_table" "stores_map" {
  name = "Threadpool_Stores_Map"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "inksoft_store_id"

  attribute {
    name = "inksoft_store_id"
    type = "N"
  }

  attribute {
    name = "printful_store_id"
    type = "N"
  }

  global_secondary_index {
    name = "PrintfulStoreId"
    hash_key = "printful_store_id"
    projection_type = "ALL"
  }
}

resource "aws_dynamodb_table" "summary_events" {
  name = "Threadpool_Summary_Events"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "id"

  attribute {
    name = "id"
    type = "S"
  }

  ttl {
    enabled = true
    attribute_name = "expires"
  }
}
