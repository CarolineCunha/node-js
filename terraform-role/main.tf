resource "aws_iam_role_policy" "logs-dev-us-east-1-lambdaRole" {
  name = "logs-dev-us-east-1-lambdaRole"
  role = aws_iam_role.logs-dev-us-east-1-lambdaRole.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "lambda:*",
        ]
        Effect   = "Allow"
        Resource = "*"
      },
      {
            "Action": [
                "logs:CreateLogStream",
                "logs:CreateLogGroup"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:328367910941:log-group:/aws/lambda/logs-dev-hello*:*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "logs:PutLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:328367910941:log-group:/aws/lambda/logs-dev-hello*:*:*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "lambda:InvokeFunction"
            ],
            "Resource": [
                "*"
            ],
            "Effect": "Allow"
        }
    ]
  })
}

resource "aws_iam_role" "logs-dev-us-east-1-lambdaRole" {
  name = "logs-dev-us-east-1-lambdaRole"
 
 assume_role_policy = <<EOT
{
    "Version": "2012-10-17",
    "Statement": [
        {
             "Action": [
                "sts:AssumeRole"
            ],
            "Effect": "Allow",
            "Sid": "",
            "Principal": {
               "Service": "lambda.amazonaws.com" 
            }
        }
        
    ]
}
EOT
}
