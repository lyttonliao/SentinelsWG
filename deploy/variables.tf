variable "prefix" {
  default = "sents"
}

variable "project" {
  default = "sentinels-api-devops"
}

variable "contact" {
  default = "lytton.liao@gmail.com"
}

variable "db_username" {
  description = "Username for the RDS postgres instance"
}

variable "db_password" {
  description = "Password for the RDS postgres instance"
}

variable "bastion_key_name" {
  default = "sentinels-api-devops-bastion"
}

variable "ecr_image_api" {
  description = "ECR image for API"
  default     = "843472542811.dkr.ecr.us-east-1.amazonaws.com/sentinels-api-devops:latest"
}

variable "ecr_image_proxy" {
  description = "ECR image for proxy"
  default     = "843472542811.dkr.ecr.us-east-1.amazonaws.com/sentinels-api-proxy:latest"
}

variable "django_secret_key" {
  description = "Secret key for Django app"
}

variable "dns_zone_name" {
  description = "Domain name"
  default     = "sentinelswg.com"
}

variable "subdomain" {
  description = "Subdomain per environment"
  type        = map(string)
  default = {
    production = "api"
    staging    = "api.staging"
    dev        = "api.dev"
  }
}