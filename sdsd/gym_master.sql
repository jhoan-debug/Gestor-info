CREATE DATABASE IF NOT EXISTS gym_master
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_spanish_ci;

USE gym_master;

SET NAMES 'utf8mb4' COLLATE 'utf8mb4_spanish_ci';

-- 1. Clientes
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 2. Entrenadores
CREATE TABLE entrenadores (
    id_entrenador INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(100) NOT NULL,
    especialidad VARCHAR(50),
    salario DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 3. Planes
CREATE TABLE planes (
    id_plan INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plan VARCHAR(50) NOT NULL,
    precio DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 4. Membresías
CREATE TABLE membresias (
    id_membresia INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_plan INT NOT NULL,
    fecha_fin DATE NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_plan) REFERENCES planes(id_plan)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 5. Clases
CREATE TABLE clases (
    id_clase INT AUTO_INCREMENT PRIMARY KEY,
    nombre_clase VARCHAR(50) NOT NULL,
    id_entrenador INT
    -- Nota: No ponemos FOREIGN KEY obligatoria para poder probar LEFT JOIN
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 6. Reservas
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_clase INT NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_clase) REFERENCES clases(id_clase)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- 7. Pagos
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATE NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;


-- INSERCIÓN DE DATOS DE PRUEBA
INSERT INTO clientes (nombre, apellido, email) VALUES
('Felipe', 'Guevara', 'felipe@mail.com'),
('Luis', 'Díaz', 'luis.d@mail.com'),
('Ana', 'Muñoz', 'ana@mail.com'),
('Carlos', 'López', 'carlos@mail.com'),
('Sofía', 'Ramírez', 'sofia@mail.com');

INSERT INTO entrenadores (nombre_completo, especialidad, salario) VALUES
('Jorge Pérez', 'Musculación', 1500000.00),
('Marta Gómez', 'Crossfit', 1800000.00),
('Diego Ruiz', 'Yoga', 1200000.00),
('Laura Castro', 'Pilates', 1300000.00);

INSERT INTO planes (nombre_plan, precio) VALUES
('Básico', 60000.00),
('Pro', 100000.00),
('Premium', 150000.00);

INSERT INTO membresias (id_cliente, id_plan, fecha_fin) VALUES
(1, 3, '2026-12-31'),
(2, 2, '2026-10-15'),
(3, 1, '2026-09-01');

INSERT INTO clases (nombre_clase, id_entrenador) VALUES
('Hipertrofia', 1),
('Resistencia', 2),
('Relajación', 3),
('Zumba', NULL); -- Clase sin entrenador asignado aún

INSERT INTO reservas (id_cliente, id_clase) VALUES
(1, 1), (1, 2),
(2, 1),
(3, 3);

INSERT INTO pagos (id_cliente, monto, fecha_pago) VALUES
(1, 150000.00, '2026-09-01'),
(2, 100000.00, '2026-09-02'),
(3, 60000.00, '2026-09-03'),
(1, 150000.00, '2026-08-01');