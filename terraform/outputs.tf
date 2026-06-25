output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.devpulse_server.id
}

output "public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_instance.devpulse_server.public_ip
}

output "ssh_command" {
  description = "SSH command to connect to the EC2 instance"
  value       = "ssh -i ../keys/devpulse-ec2-key ubuntu@${aws_instance.devpulse_server.public_ip}"
}

output "backend_url" {
  description = "Backend API URL"
  value       = "http://${aws_instance.devpulse_server.public_ip}:5000"
}

output "grafana_url" {
  description = "Grafana dashboard URL"
  value       = "http://${aws_instance.devpulse_server.public_ip}:3000"
}
