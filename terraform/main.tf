# ----------------------------
# Threadpool networking module
# ----------------------------

module "network" {
  source = "./modules/network"

  service_name = "threadpool-network"
  service_env = terraform.workspace
  
  vpc__cidr = var.vpc__cidr
  vpc__public-subnets = var.vpc__public-subnets
  vpc__private-subnets = var.vpc__private-subnets
}


# ---------------
# Service modules
# ---------------



# ----------------
# Main eventbridge
# ----------------

module "eventbridge" {
  source  = "terraform-aws-modules/eventbridge/aws"
  version = "1.17.1"
  
  bus_name = "threadpool-event-bus"

  # rules = {
  #   crons = {
  #     description = "Test cron trigger for lambda"
  #     schedule_expression = "rate(1 minute)"
  #   }
  # }

  # targets = {
  #   crons = [
  #     {
  #       name = "test-lambda-cron"
  #       arn = module.test-service.lambda_function.arn
  #     }
  #   ]
  # }

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
      schedule_expression = "rate(1 minute)"
    }
  }

  targets = {
    crons = [
      {
        name = "inksoft-orders-sync"
        arn = module.test-service.lambda_function_arn
        input = jsonencode({ "job" : "cron-by-rate" })
      }
    ]
  }
}
