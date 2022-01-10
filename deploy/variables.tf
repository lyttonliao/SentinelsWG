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