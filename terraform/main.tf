provider "aws"{
    region = "us-east-1"
}

resource "aws_s3_bucket" "my-test-bucket" {
  bucket = "my-tf-test-bucket-37437474r8748344111"
  acl    = "private"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
    Managedby = "Terraform"
  }
}

resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "GameScores"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "UserId"

  attribute {
    name = "UserId"
    type = "S"
  }

  tags = {
    Name        = "dynamodb-table-1"
    Environment = "dev"
  }
}