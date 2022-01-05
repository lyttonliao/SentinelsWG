terraform {
  backend "s3" {
    bucket         = "sentinels-api-devops-tfstate"
    key            = "sentinels.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "sentinels-api-devops-tfstate-lock"
  }
}

provider "aws" {
  region  = "us-east-1"
  version = "~> 2.54.0"
}

locals {
  prefix = "${var.prefix}-${terraform.workspace}"
  common_tags = {
    Environment = terraform.workspace
    Project     = var.project
    Owner       = var.contact
    ManagedBy   = "Terraform"
  }
}

