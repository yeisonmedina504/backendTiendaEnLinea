CREATE DATABASE [4Js Store]
USE [4Js Store]


-- 1. DEL CATÁLOGO
CREATE TABLE categoria (  
    id_categoria        INT IDENTITY(1,1) PRIMARY KEY,  
    nombre_categoria    VARCHAR(50) NOT NULL,  
    descripcion         VARCHAR(100) NULL  
);  

CREATE TABLE marca (  
    id_marca            INT IDENTITY(1,1) PRIMARY KEY,  
    nombre_marca        VARCHAR(100) NOT NULL,  
    descripcion         VARCHAR(100) NULL  
);  

-- 2. PROVEEDORES Y LOGISTICA DE INGRESO
CREATE TABLE proveedores (  
    id_proveedor        INT IDENTITY(1,1) PRIMARY KEY,  
    rtn                 VARCHAR(14) NOT NULL UNIQUE,  
    nombre_proveedor    VARCHAR(150) NOT NULL,  
    contacto_nombre     VARCHAR(100) NULL,  
    email               VARCHAR(100) NOT NULL,  
    telefono            VARCHAR(20) NULL,  
    direccion           VARCHAR(200) NULL,  
    ciudad              VARCHAR(40) NULL,  
    activo              BIT NOT NULL DEFAULT 1  
);  

CREATE TABLE factura_ingreso_proveedor (  
    id_ingreso          INT IDENTITY(1,1) PRIMARY KEY,  
    id_proveedor        INT NOT NULL,  
    num_factura_proveedor VARCHAR(50) NOT NULL,  
    cai_proveedor         VARCHAR(40) NULL,                  
    tipo_compra           VARCHAR(20) NOT NULL DEFAULT 'LOCAL', 
    estado_pago           VARCHAR(20) NOT NULL DEFAULT 'PAGADO',
    fecha_factura       DATE NOT NULL,                       
    fecha_ingreso       DATETIME NOT NULL DEFAULT GETDATE(), 
    subtotal_compra     DECIMAL(14,2) NOT NULL DEFAULT 0.00, 
    descuento_proveedor DECIMAL(14,2) NOT NULL DEFAULT 0.00, 
    importe_exento      DECIMAL(14,2) NOT NULL DEFAULT 0.00, 
    importe_gravado_15  DECIMAL(14,2) NOT NULL DEFAULT 0.00, 
    isv_pagado_15       DECIMAL(14,2) NOT NULL DEFAULT 0.00, 
    gasto_flete_aduana  DECIMAL(14,2) NOT NULL DEFAULT 0.00, 
    total_factura       DECIMAL(14,2) NOT NULL,              
    notas               VARCHAR(300) NULL,  

    CONSTRAINT FK_Ingreso_Proveedor FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
);  


-- 3. INVENTARIO 
CREATE TABLE inventario (  
    id_producto       INT IDENTITY(1,1) PRIMARY KEY,  
    SKU                 VARCHAR(100) NOT NULL UNIQUE,  
    nombre_productos    VARCHAR(100) NOT NULL,  
    descripcion         VARCHAR(100) NULL,  
    stock_actual  int  NOT NULL default 0,  
    stock_minimo int  NOT NULL DEFAULT 5,        
    descuento decimal(10,2) default 0.00,
    PrecioVenta         DECIMAL(10,2) NOT NULL,  
    id_categoria        INT NOT NULL,  
    id_marca            INT NOT NULL,  
    estado BIT NOT NULL DEFAULT 1, 

    CONSTRAINT FK_inventario_categoria FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria),  
    CONSTRAINT FK_inventario_marca FOREIGN KEY (id_marca) REFERENCES marca(id_marca),
);  


CREATE TABLE detalle_factura_ingreso (  
    id_detalle_ingreso  INT IDENTITY(1,1) PRIMARY KEY,  
    id_ingreso          INT NOT NULL,  
    id_producto         INT NOT NULL,
    cantidad_ingresada  INT NOT NULL,  
    costo_unitario_factura DECIMAL(10,2) NOT NULL,  
    porcentaje_isv_pagado DECIMAL(5,2) NOT NULL DEFAULT 15.00, 
    isv_linea_pagado      DECIMAL(10,2) NOT NULL DEFAULT 0.00, 
    costo_real_prorrateado DECIMAL(10,2) NOT NULL DEFAULT 0.00, 
    
    CONSTRAINT FK_DetalleIngreso_Maestro FOREIGN KEY (id_ingreso) REFERENCES factura_ingreso_proveedor(id_ingreso),  
    CONSTRAINT FK_DetalleIngreso_Producto FOREIGN KEY (id_producto) REFERENCES inventario(id_producto),
    CONSTRAINT CHK_DetalleIngreso_Cantidad CHECK (cantidad_ingresada > 0),
    CONSTRAINT CHK_DetalleIngreso_ISV CHECK (porcentaje_isv_pagado IN (0, 15, 18))
);  


-- 4. MÓDULO DE CLIENTES, DIRECCIONES Y PERSONAL
CREATE TABLE clientes (  
    id_cliente         INT IDENTITY(1,1) PRIMARY KEY,  
    nombre              VARCHAR(100) NOT NULL,  
    apellido            VARCHAR(100) NOT NULL,  
    razon_social        VARCHAR(100) NULL,  
    identidad           VARCHAR(14) NOT NULL UNIQUE,  
    RTN                 varchar(20) NOT NULL UNIQUE,
    fecha_nacimiento    DATE NULL,  
    fecha_registro      DATE NOT NULL DEFAULT GETDATE(),  
    telefono            VARCHAR(20) NULL,  
    direccion           varchar(200) not null,
    email               VARCHAR(100) NULL,
    contraseña         varchar(100) not null
);  

CREATE TABLE cargo(
    id_cargo            INT IDENTITY(1,1) PRIMARY KEY,
    nombre_cargo        VARCHAR(50) NOT NULL UNIQUE,
    descripcion         VARCHAR(100) NULL
);

CREATE TABLE Empleados (  
    id_empleado         INT IDENTITY(1,1) PRIMARY KEY,  
    identidad           VARCHAR(14) NOT NULL UNIQUE,  
    nombre              VARCHAR(80) NOT NULL,  
    segundo_nombre      VARCHAR(80) NOT NULL,  
    apellido            VARCHAR(80) NOT NULL,  
    segundo_apellido    VARCHAR(80) NOT NULL,  
    email               VARCHAR(100) NOT NULL UNIQUE,  
    contraseña VARCHAR(100) NOT  NULL,
    telefono            VARCHAR(20) NULL,  
    fecha_contratacion  DATE NOT NULL,  
    fecha_nacimiento    DATE NOT NULL,  
    estado              VARCHAR(20) NOT NULL DEFAULT 'activo',
    id_cargo            INT NOT NULL,
    
    CONSTRAINT FK_Empleado_Cargo FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo)

);  


-- 5. GESTIÓN DE ÓRDENES (CARRITO DE COMPRAS)
CREATE TABLE orden (  
    id_orden            INT IDENTITY(1,1) PRIMARY KEY,  
    id_cliente          INT NOT NULL,  
    fecha_orden         DATETIME NOT NULL DEFAULT GETDATE(),  
    estado              VARCHAR(20) NOT NULL DEFAULT 'pendiente',  
    subtotal            DECIMAL(14,2) NOT NULL,  
    isv                 DECIMAL(14,2) NOT NULL,  
    total               DECIMAL(14,2) NOT NULL,  

    CONSTRAINT FK_orden_cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),  
);  

-- 6. INFRAESTRUCTURA Y CONTROL FISCAL (SAR HONDURAS)

CREATE TABLE autorizacion_sar (  
    id_autorizacion     INT IDENTITY(1,1) PRIMARY KEY,  
    nombre_surcursal  VARCHAR(80) NOT NULL,  
    cofigoSAR char(3) NOT NULL,
    codigo_punto CHAR(3) NOT NULL,  
    cai    VARCHAR(40) NOT NULL UNIQUE,
    telefono VARCHAR(15) NULL,  
    direccion VARCHAR(200) NOT NULL,
    tipo_documento      VARCHAR(20) NOT NULL DEFAULT 'factura',  
    rango_inicial       BIGINT NOT NULL,  
    rango_final         BIGINT NOT NULL,  
    correlativo_actual  BIGINT NOT NULL,  
    fecha_limite_emision DATE NOT NULL,  
    fecha_autorizacion  DATE NOT NULL,  
    activo              BIT NOT NULL DEFAULT 1,  
    
    CONSTRAINT CHK_SAR_Rango_Valido CHECK (rango_inicial < rango_final),  
    CONSTRAINT CHK_SAR_Correlativo_EnRango CHECK (correlativo_actual BETWEEN rango_inicial AND rango_final)  
);  


-- 7. TRANSACCIÓN DE VENTA Y FACTURACIÓN FINAL
CREATE TABLE Factura (  
    id_factura          INT IDENTITY(1,1) PRIMARY KEY,  
    id_autorizacion     INT NOT NULL,  
    id_orden            INT NOT NULL,  
    num_factura_sar     VARCHAR(19) NOT NULL UNIQUE,  
    cai                 VARCHAR(37) NOT NULL,  
    id_cliente          INT NOT NULL,  
    id_empleado         INT NULL,  
    fecha_emision       DATETIME NOT NULL DEFAULT GETDATE(),  
    fecha_vencimiento   DATETIME NULL,  
    subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    importe_gravado_15  DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    montoisv_15         DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    total_descuentos    DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    total               DECIMAL(10,2) NOT NULL,  
    es_anulada          BIT NOT NULL DEFAULT 0,  
    fecha_anulacion     DATETIME NULL,  
    motivo_anulacion    VARCHAR(200) NULL,  
    notas               VARCHAR(300) NULL,  
    fecha_registro      DATETIME NOT NULL DEFAULT GETDATE(),  
    
    CONSTRAINT FK_Factura_Autorizacion FOREIGN KEY (id_autorizacion) REFERENCES autorizacion_sar(id_autorizacion),  
    CONSTRAINT FK_Factura_Orden FOREIGN KEY (id_orden) REFERENCES orden(id_orden),  
    CONSTRAINT FK_Factura_Cliente FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),  
    CONSTRAINT FK_Factura_Empleado FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado),  
);  

CREATE TABLE DetalleFactura (  
    id_detalle          INT IDENTITY(1,1) PRIMARY KEY,  
    id_factura          INT NOT NULL,  
    id_producto       INT NOT NULL,                        
    cantidad            INT NOT NULL DEFAULT 1,              
    PrecioUnitarioHistorico DECIMAL(10,2) NOT NULL,  
    descuento           DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    subtotal            DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    porcentaje_isv_aplicado DECIMAL(10,2) NOT NULL DEFAULT 15.00,  
    isv_linea           DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    total_linea         DECIMAL(10,2) NOT NULL DEFAULT 0.00,  
    
    CONSTRAINT FK_Detalle_Factura FOREIGN KEY (id_factura) REFERENCES Factura(id_factura),  
    CONSTRAINT FK_Detalle_Producto FOREIGN KEY (id_producto) REFERENCES inventario(id_producto),  
);  


-- 8. MÉTODOS DE PAGO Y CAJA
CREATE TABLE metodos_pago (  
    id_metodo           INT IDENTITY(1,1) PRIMARY KEY,  
    codigo              VARCHAR(50) NOT NULL UNIQUE,  
    nombre              VARCHAR(100) NOT NULL UNIQUE,  
    descripcion         VARCHAR(100) NULL  
);  

CREATE TABLE Pagos (  
    id_pago             INT IDENTITY(1,1) PRIMARY KEY,  
    id_factura          INT NOT NULL,  
    id_metodo           INT NOT NULL,  
    monto               DECIMAL(10,2) NOT NULL,  
    referencia          VARCHAR(50) NULL,  
    fecha_pago          DATETIME NOT NULL DEFAULT GETDATE(),  
    
    CONSTRAINT FK_Pagos_Factura FOREIGN KEY (id_factura) REFERENCES Factura(id_factura),  
    CONSTRAINT FK_Pagos_Metodo FOREIGN KEY (id_metodo) REFERENCES metodos_pago(id_metodo),  
    CONSTRAINT CHK_Pagos_Monto_Positivo CHECK (monto > 0)  
);  
