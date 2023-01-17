locals {
  packages_dir = "${abspath(path.module)}/../dist"
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
  min_start_time_param_id = var.inksoft__orders-sync-min-start-time-param-id
  start_offset_param_id = var.inksoft__orders-sync-start-offset-param-id
}

module "inksoft-order-summary-translator-service" {
  source = "./services/inksoft-order-summary-translator"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  inksoft_order_table_name = module.data-storage.inksoft_orders_table.name

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["inksoft-order-summary-received"]
  target_eventbridge_arn = module.eventbridge.eventbridge_bus_arn

  inksoft_api_key_secret_id = var.inksoft__api-key-secret-id
}

module "data-lake-injest-events" {
  source = "./services/data-lake-injest-events"

  packages_dir = local.packages_dir
  service_env = terraform.workspace

  eventbridge_rule_arn = module.eventbridge.eventbridge_rule_arns["all-events"]
}


# ---------------------
# Events Cloudwatch Log
# ---------------------

module "system-log" {
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

  attach_cloudwatch_policy = true
  cloudwatch_target_arns = [module.system-log.log_group.arn]

  attach_sqs_policy = true
  sqs_target_arns = [
    module.data-lake-injest-events.events_queue.arn
  ]

  rules = {
    inksoft-order-summary-received = {
      description = "Inksoft Order Summary Received events"
      event_pattern = jsonencode({ "detail-type" : ["inksoft.order_summary.received"] })
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
    all-events = [
      {
        name = "send-to-data-lake"
        arn = module.data-lake-injest-events.events_queue.arn
      },
      {
        name = "log-all-to-cloudwatch"
        arn = module.system-log.log_group.arn
      }
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
  }

  targets = {
    inksoft-orders-sync = [
      {
        name = "inksoft-orders-sync"
        arn = module.inksoft-orders-sync-service.lambda_function_arn
      }
    ]
  }
}
