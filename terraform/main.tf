provider "aws" {
  region = "us-east-1"
}

locals {
  tags = {
    Name        = "teste"
    Owner       = "teste"
    Environment = "staging"
    Repository  = "https://github.com/"
  }
}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name         = "teste-staging"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "provider"
    type = "S"
  }

  global_secondary_index {
    name               = "provider"
    hash_key           = "provider"
    projection_type    = "INCLUDE"
    non_key_attributes = ["id"]
  }
}


