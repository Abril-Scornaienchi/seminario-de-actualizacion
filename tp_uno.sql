-- Crear tabla Usuario
CREATE TABLE Usuario (
  id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  correo_electronico VARCHAR(255) UNIQUE NOT NULL,
  contrasena VARCHAR(255) NOT NULL
);

-- Crear tabla Grupo
CREATE TABLE Grupo (
  id_grupo INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT
);

-- Crear tabla Accion
CREATE TABLE Accion (
  id_accion INT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT
);

-- Crear tabla Permiso
CREATE TABLE Permiso (
  id_permiso INT PRIMARY KEY AUTO_INCREMENT,
  id_grupo INT NOT NULL,
  id_accion INT NOT NULL,
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo),
  FOREIGN KEY (id_accion) REFERENCES Acciones(id_accion)
);

-- Crear tabla Usuario_Grupo
CREATE TABLE Usuario_Grupo (
  id_usuario_grupo INT PRIMARY KEY AUTO_INCREMENT,
  id_usuario INT NOT NULL,
  id_grupo INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
  FOREIGN KEY (id_grupo) REFERENCES Grupos(id_grupo)
);

-- Insert data into Usuario table
INSERT INTO Usuario (nombre, apellido, correo_electronico, contrasena)
VALUES ('John', 'Doe', 'johndoe@example.com', 'password1'),
      ('Jane', 'Smith', 'janesmith@example.com', 'password2'),
      ('Peter', 'Jones', 'peterjones@example.com', 'password3'),
      ('Mary', 'Williams', 'marywilliams@example.com', 'password4'),
      ('David', 'Brown', 'davidbrown@example.com', 'password5');

-- Insert data into Grupo table
INSERT INTO Grupo (nombre, descripcion)
VALUES ('Administradores', 'Grupo con acceso total al sistema'),
      ('Vendedores', 'Grupo con acceso a módulos de ventas'),
      ('Clientes', 'Grupo con acceso a módulos de cliente');

-- Insert data into Accion table
INSERT INTO Accion (nombre, descripcion)
VALUES ('Crear usuario', 'Acción para crear nuevos usuarios'),
      ('Editar usuario', 'Acción para modificar usuarios existentes'),
      ('Eliminar usuario', 'Acción para eliminar usuarios'),
      ('Crear grupo', 'Acción para crear nuevos grupos'),
      ('Editar grupo', 'Acción para modificar grupos existentes'),
      ('Eliminar grupo', 'Acción para eliminar grupos'),
      ('Ver ventas', 'Acción para visualizar datos de ventas'),
      ('Realizar venta', 'Acción para registrar nuevas ventas'),
      ('Ver información de cliente', 'Acción para visualizar datos de clientes');

-- Insert data into Permiso table
INSERT INTO Permiso (id_grupo, id_accion)
VALUES (1, 1),
      (1, 2),
      (1, 3),
      (1, 4),
      (1, 5),
      (1, 6),
      (1, 7),
      (1, 8),
      (1, 9),
      (2, 7),
      (2, 8),
      (3, 9);
