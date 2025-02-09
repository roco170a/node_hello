terraform {
  required_version = ">= 1.0.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region     = "us-east-2"
  access_key = "XXX"
  secret_key = "XXX-XXX"
}

# Crear un KeyPair
resource "aws_lightsail_key_pair" "rcorona01" {
  name = "mi-key-pair"  # Nombre del KeyPair
}

# Guardar la clave privada en un archivo
resource "local_file" "private_key" {
  content  = aws_lightsail_key_pair.rcorona01.private_key
  filename = "${path.module}/mi-key-pair.pem"  # Nombre del archivo donde se guardará la clave privada
}

# Crear una instancia de Lightsail con Ubuntu 20.04 y el plan nano con soporte IPv6
resource "aws_lightsail_instance" "rcorona01" {
  name              = "server-pruebas"
  availability_zone = "us-east-2a"
  blueprint_id      = "ubuntu_24_04"  # Usar Ubuntu 20.04
  bundle_id         = "small_3_0" # Usar el plan nano con soporte IPv6
  key_pair_name     = aws_lightsail_key_pair.rcorona01.name  # Usar el KeyPair creado
}

# Abrir los puertos 22, 3000 en la instancia y permitir tráfico desde cualquier IP
resource "aws_lightsail_instance_public_ports" "rcorona01" {
  instance_name = aws_lightsail_instance.rcorona01.name

  # Regla para el puerto 22 (SSH)
  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22    
  }

  # Regla para el puerto hhtps (Alternativo)
  port_info {
    protocol  = "tcp"
    from_port = 3000
    to_port   = 3000    
  }
}

# Mostrar la dirección IPv6 de la instancia
output "ipv6_address" {
  value = aws_lightsail_instance.rcorona01.public_ip_address
}

# Mostrar el nombre del KeyPair
output "key_pair_name" {
  value = aws_lightsail_key_pair.rcorona01.name
}


resource "null_resource" "rcorona01" {
  # Ejecutar comandos después de crear la instancia
  provisioner "remote-exec" {
    inline = [
      # Actualizar el ambiente
      "sudo apt update -y",    
      "sudo apt upgrade -y",      
      
      # Se clona el repo y se instala el servicio para asegurar que funcione todo bien
      "git clone https://github.com/roco170a/node_hello.git",      
      "cd /home/ubuntu/node_hello",

      # Se instala la ultima version de node
      "sudo npm cache clean -f ",
      "sudo npm install -g n ",
      "sudo n stable ",
      "sudo n latest ",
      "sudo apt-get install --reinstall nodejs-legacy "

    ]

    # Configuración de la conexión SSH
    connection {
      type        = "ssh"
      user        = "ubuntu"  # Usuario por defecto en Ubuntu
      private_key = aws_lightsail_key_pair.rcorona01.private_key
      host        = aws_lightsail_instance.rcorona01.public_ip_address
    }
  }
}