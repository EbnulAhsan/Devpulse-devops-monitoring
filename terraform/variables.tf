variable "aws_region" {
  description = "AWS region for deploying the EC2 instance"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Project name used for AWS resource naming"
  type        = string
  default     = "devpulse-devops-monitoring"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "public_key_path" {
  description = "Path to the SSH public key"
  type        = string
  default     = "../keys/devpulse-ec2-key.pub"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance"
  type        = string
  default     = "0.0.0.0/0"
}
