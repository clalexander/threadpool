locals {
  packages_dir = "${abspath(path.module)}/../dist"
  is_prod = terraform.workspace == "production"
}

# ----------------------------
# Threadpool networking module
# ----------------------------

// Not using custom vpc for lambda functions because of the cost of the NAT Gateway
# module "network" {
#   source = "./modules/network"

#   service_name = "threadpool-network"
#   service_env = terraform.workspace
  
#   vpc__cidr = var.vpc__cidr
#   vpc__public-subnets = var.vpc__public-subnets
#   vpc__private-subnets = var.vpc__private-subnets
# }



# -----------------------
# Threadpool data storage
# -----------------------

module "data-storage" {
  source ="./services/data-storage"
}



# ------------------------
# Threadpool notifications
# ------------------------

module "notifications" {
  source ="./services/notifications"
}



# ---------------
# Service modules
# ---------------

module "inksoft-orders-sync-service" {
  source = "./services/inksoft-orders-sync"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  eventbridge_rule_arn = module.default-eventbridge.eventbridge_rule_arns["inksoft-orders-sync"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  inksoft_api_key_secret_id = var.inksoft__api-key-secret-id
  inksoft_api_base_url_param_id = var.inksoft__api-base-url-param-id
  min_start_time_param_id = var.inksoft__orders-sync-min-start-time-param-id
  start_offset_param_id = var.inksoft__orders-sync-start-offset-param-id
}

module "inksoft-order-summary-translator-service" {
  source = "./services/inksoft-order-summary-translator"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  inksoft_orders_table_name = module.data-storage.inksoft_orders_table.name

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["inksoft-order-summary-received"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  inksoft_api_key_secret_id = var.inksoft__api-key-secret-id
  inksoft_api_base_url_param_id = var.inksoft__api-base-url-param-id
}

module "inksoft-order-shipments-writeback-service" {
  source = "./services/inksoft-order-shipments-writeback"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  inksoft_orders_table_name = module.data-storage.inksoft_orders_table.name

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["printful-package-shipped"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  inksoft_api_key_secret_id = var.inksoft__api-key-secret-id
  inksoft_api_base_url_param_id = var.inksoft__api-base-url-param-id
}

module "printful-order-fulfillment-service" {
  source = "./services/printful-order-fulfillment"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  printful_orders_table_name = module.data-storage.printful_orders_table.name
  stores_map_table_name = module.data-storage.stores_map_table.name

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["inksoft-order-received-updated"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  printful_api_token_secret_id = var.printful__api-token-secret-id
}

module "printful-webhook-service" {
  source = "./services/printful-webhook"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  webhook_token_secret_id = var.printful-webhook__token-secret-id
}

module "printful-webhook-manager-service" {
  source = "./services/printful-webhook-manager"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["printful-webhook-config"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  printful_api_token_secret_id = var.printful__api-token-secret-id
  printful_webhook_url = module.printful-webhook-service.api_gateway_endpoint
  printful_webhook_token_secret_id = var.printful-webhook__token-secret-id
}

module "stores-map-event-stream-service" {
  source = "./services/stores-map-event-stream"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  stores_map_table_name = module.data-storage.stores_map_table.name
  stores_map_table_stream_arn = module.data-storage.stores_map_table.stream_arn
}

module "stores-map-translator-service" {
  source = "./services/stores-map-translator"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["stores-map-events"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn
}

module "summary-injest-events-service" {
  source = "./services/summary-injest-events"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  summary_events_table_name = module.data-storage.summary_events_table.name
  event_ttl_param_id = var.summary-event__event-ttl-param-id

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["all-events"]
}

module "daily-summary-service" {
  source = "./services/daily-summary"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  eventbridge_rule_arn = module.default-eventbridge.eventbridge_rule_arns["daily-summary"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  summary_events_table_name = module.data-storage.summary_events_table.name
  sns_email_notifications_arn = module.notifications.sns_email_notifications.arn
}

module "data-lake-injest-events-service" {
  source = "./services/data-lake-injest-events"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["all-events"]
}


# ---------------------
# Events Cloudwatch Log
# ---------------------

module "system-log" {
  count = local.is_prod ? 0 : 1

  source = "./services/system-log"

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["all-events"]
}


# ----------------
# Main eventbridge
# ----------------

module "eventbridge" {
  source  = "terraform-aws-modules/eventbridge/aws"
  version = "1.17.1"
  
  bus_name = "threadpool"

  create_schemas_discoverer = true

  attach_cloudwatch_policy = !local.is_prod
  cloudwatch_target_arns = local.is_prod ? [] : [module.system-log[0].log_group.arn]

  attach_sqs_policy = true
  sqs_target_arns = [
    module.inksoft-order-summary-translator-service.events_queue.arn,
    module.printful-order-fulfillment-service.events_queue.arn,
    module.inksoft-order-shipments-writeback-service.events_queue.arn,
    module.printful-webhook-manager-service.events_queue.arn,
    module.stores-map-translator-service.events_queue.arn,
    module.data-lake-injest-events-service.events_queue.arn,
    module.summary-injest-events-service.events_queue.arn
  ]

  rules = {
    inksoft-order-summary-received = {
      description = "Inksoft Order Summary Received events"
      event_pattern = jsonencode({ "detail-type" : ["inksoft.order_summary.received"] })
    }
    inksoft-order-received-updated = {
      description = "Inksoft Order received or updated events"
      event_pattern = jsonencode({ "detail-type" : ["inksoft.order.received", "inksoft.order.updated"] })
    }
    printful-package-shipped = {
      description = "Printful package shipped event from webhook"
      event_pattern = jsonencode({
        "source": ["printful"],
        "detail-type": ["package_shipped"]
      })
    }
    printful-webhook-config = {
      description = "Printful webhook config events"
      event_pattern = jsonencode({ "detail-type" : [{"prefix": "printful_webhook_config."}] })
    }
    stores-map-events = {
      description = "All stores map events"
      event_pattern = jsonencode({ "detail-type" : [{"prefix": "stores_map."}] })
    }
    all-events = {
      description = "All events from the bus"
      event_pattern = jsonencode({ "source" : [{"prefix": ""}] })
    }
  }

  targets = {
    inksoft-order-summary-received = [
      {
        name = "send-to-inksoft-order-summary-translator"
        arn = module.inksoft-order-summary-translator-service.events_queue.arn
      }
    ]
    inksoft-order-received-updated = [
      {
        name = "send-to-printful-order-fulfillment"
        arn = module.printful-order-fulfillment-service.events_queue.arn
      }
    ]
    printful-package-shipped = [
      {
        name = "send-to-inksoft-order-shipments-writeback"
        arn = module.inksoft-order-shipments-writeback-service.events_queue.arn
      }
    ]
    printful-webhook-config = [
      {
        name = "send-to-printful-webhook-manager"
        arn = module.printful-webhook-manager-service.events_queue.arn
      }
    ]
    stores-map-events = [
      {
        name = "send-to-stores-map-translator"
        arn = module.stores-map-translator-service.events_queue.arn
      }
    ]
    all-events = [
      {
        name = "send-to-data-lake"
        arn = module.data-lake-injest-events-service.events_queue.arn
      },
      {
        name = "send-to-summary-events"
        arn = module.summary-injest-events-service.events_queue.arn
      },
      {
        count = local.is_prod ? 0 : 1
        name = "log-all-to-cloudwatch"
        arn = module.system-log[0].log_group.arn
      },
    ]
  }

  tags = {
    Name = "threadpool-event-bus"
  }
}


# -------------------------------------
# Default eventbridge for cron triggers
# -------------------------------------

module "default-eventbridge" {
  source  = "terraform-aws-modules/eventbridge/aws"
  version = "1.17.1"
  
  create_bus = false

  rules = {
    inksoft-orders-sync = {
      description = "Cron trigger for InkSoft Orders Sync service"
      schedule_expression = "cron(0/${var.inksoft__orders-sync-frequency} * * * ? *)"
    }
    daily-summary = {
      description = "Cron trigger for Threadpooly Daily Summary service"
      schedule_expression = "cron(0 0 * * ? *)"
    }
  }

  targets = {
    inksoft-orders-sync = [
      {
        name = "inksoft-orders-sync"
        arn = module.inksoft-orders-sync-service.lambda_function_arn
      }
    ]
    daily-summary = [
      {
        name = "daily-summary"
        arn = module.daily-summary-service.lambda_function_arn
      }
    ]
  }
}
