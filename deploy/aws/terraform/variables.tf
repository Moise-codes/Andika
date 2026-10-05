variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "andika"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_storage" {
  description = "RDS storage in GB"
  type        = number
  default     = 20
}

variable "db_username" {
  description = "RDS username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "RDS password"
  type        = string
  sensitive   = true
}

variable "backend_cpu" {
  description = "Backend CPU units"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Backend memory in MB"
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Backend desired task count"
  type        = number
  default     = 2
}

variable "frontend_cpu" {
  description = "Frontend CPU units"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Frontend memory in MB"
  type        = number
  default     = 512
}

variable "frontend_desired_count" {
  description = "Frontend desired task count"
  type        = number
  default     = 2
}

variable "backend_url" {
  description = "Backend URL for frontend to connect to"
  type        = string
  default     = "http://localhost:3001"
}

variable "ssl_certificate_arn" {
  description = "SSL certificate ARN for HTTPS"
  type        = string
  default     = ""
}

variable "supabase_url" {
  description = "Supabase URL"
  type        = string
  sensitive   = true
}

variable "supabase_service_role_key" {
  description = "Supabase service role key"
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "Supabase anonymous key"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for authentication"
  type        = string
  sensitive   = true
}
