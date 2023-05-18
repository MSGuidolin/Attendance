CREATE DATABASE if not exists db_attendance;

USE db_attendance;


CREATE TABLE dias (
    id INT(1) NOT NULL,
    dia VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);
DESCRIBE dias;


CREATE TABLE tipoAnuncios (
    id INT(1) NOT NULL,
    tipo VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);

DESCRIBE tipoAnuncios;


CREATE TABLE regularidades (
    id INT(1) NOT NULL,
    nombre VARCHAR(45) NOT NULL,
    descripcion TEXT NOT NULL, 
    PRIMARY KEY (id)
);

DESCRIBE regularidades;


CREATE TABLE tipoCursos (
    id INT(1) NOT NULL,
    tipo VARCHAR(45) NOT NULL,
    PRIMARY KEY (id)
);

DESCRIBE tipoCursos;


CREATE TABLE libros (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL,
    editorial VARCHAR(45) NOT NULL,
    añoPublicacion INT(4) NOT NULL,
    cantUnidades INT(11) NOT NULL,
    PRIMARY KEY (id)
);

DESCRIBE libros;


CREATE TABLE roles (
    rol VARCHAR(45) NOT NULL,
    PRIMARY KEY(rol)
);


CREATE TABLE usuarios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    dni INT(11) NOT NULL UNIQUE,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    direccion VARCHAR(45) NOT NULL,
    telefono VARCHAR(45),
    contraseña VARCHAR(45) NOT NULL,
    rol VARCHAR(45) NOT NULL,
    CONSTRAINT fk_rol FOREIGN KEY(rol) REFERENCES roles(rol),
    PRIMARY KEY (id)
);

DESCRIBE usuarios;


CREATE TABLE cursos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(45) NOT NULL,
    horario TIME NOT NULL,
    anio INT(4) NOT NULL,
    nivel VARCHAR(45) NOT NULL,
    tipo INT(1) NOT NULL,
    CONSTRAINT fk_tipoCurso FOREIGN KEY(tipo) REFERENCES tipoCursos(id),
    profesor INT(11) NOT NULL, 
    CONSTRAINT fk_profesor FOREIGN KEY(profesor) REFERENCES usuarios(id),
    libro INT(11),
    CONSTRAINT fk_libro FOREIGN KEY(libro) REFERENCES libros(id),
    PRIMARY KEY (id)
);

DESCRIBE cursos;


CREATE TABLE anuncios (
    id INT(11) NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(45) NOT NULL,
    descripcion TEXT NOT NULL,
    created_at timestamp NOT NULL default current_timestamp,
    curso INT(11) NOT NULL,
    CONSTRAINT fk_curso FOREIGN KEY(curso) REFERENCES cursos(id),
    profesor INT(11) NOT NULL,
    CONSTRAINT fk_profesor_anuncio FOREIGN KEY(profesor) REFERENCES usuarios(id),
    tipo INT(1) NOT NULL,
    CONSTRAINT fk_tipoAnuncio FOREIGN KEY(tipo) REFERENCES tipoAnuncios(id),
    PRIMARY KEY (id)
);

DESCRIBE anuncios;


CREATE TABLE asistenciaCursos (
    id INT(11) NOT NULL AUTO_INCREMENT,
    alumno INT(11) NOT NULL,
    CONSTRAINT fk_alumno FOREIGN KEY(alumno) REFERENCES usuarios(id),
    curso INT(11) NOT NULL,
    CONSTRAINT fk_curso_asistencia FOREIGN KEY(curso) REFERENCES cursos(id),
    presentes INT(11) NOT NULL,
    ausentes INT(11) NOT NULL,
    regularidad INT(1) NOT NULL,
    CONSTRAINT fk_regularidad FOREIGN KEY(regularidad) REFERENCES regularidades(id),
    PRIMARY KEY (id)
);

DESCRIBE asistenciaCursos;


CREATE TABLE listaAlumnos (
    idListaAlumnos INT(11) NOT NULL AUTO_INCREMENT,
    alumno INT(11) NOT NULL,
    CONSTRAINT fk_alumno_lista FOREIGN KEY(alumno) REFERENCES usuarios(id),
    curso INT(11) NOT NULL,
    CONSTRAINT fk_curso_lista FOREIGN KEY(curso) REFERENCES cursos(id),
    PRIMARY KEY (idListaAlumnos)
);

DESCRIBE listaAlumnos;

CREATE TABLE clases (
    id INT(11) NOT NULL AUTO_INCREMENT,
    fecha timestamp NOT NULL default current_timestamp,
    tema VARCHAR(45) NOT NULL,
    curso INT(11) NOT NULL,
    CONSTRAINT fk_curso_clase FOREIGN KEY(curso) REFERENCES cursos(id),
    unidadUsada INT(11),
    unidadesLibro INT(11) NOT NULL,
    CONSTRAINT fk_unidadesLibro FOREIGN KEY(unidadesLibro) REFERENCES libros(id),
    presentes INT(11),
    ausentes INT(11),
    PRIMARY KEY (id)
);

DESCRIBE clases;


CREATE TABLE presentes (
    estado VARCHAR(45) NOT NULL,
    PRIMARY KEY(estado)
);


CREATE TABLE asistenciaClase (
    idClase INT(11) NOT NULL,
    CONSTRAINT fk_clase FOREIGN KEY(idClase) REFERENCES clases(id),
    idAlumno INT(11) NOT NULL,
    CONSTRAINT fk_alumno_asistencia FOREIGN KEY(idAlumno) REFERENCES usuarios(id),
    presente VARCHAR(45) NOT NULL,
    CONSTRAINT fk_presente FOREIGN KEY(presente) REFERENCES presentes(estado),
    PRIMARY KEY (idClase, idAlumno)
);

DESCRIBE asistenciaClase;

CREATE TABLE cursosdias (
    idDia INT NOT NULL,
    CONSTRAINT fk_idDia FOREIGN KEY(idDia) REFERENCES dias(id),
    idCurso INT NOT NULL,
    CONSTRAINT fk_idCurso FOREIGN KEY(idCurso) REFERENCES cursos(id),
    PRIMARY KEY (idDia, idCurso)
);

DESCRIBE cursosdias;

-- INSERTS

INSERT INTO dias VALUES
    (1, 'Lunes'),
    (2, 'Martes'),
    (3, 'Miércoles'),
    (4, 'Jueves'),
    (5, 'Viernes'),
    (6, 'Sábado');

SELECT * FROM dias;


INSERT INTO tipoCursos VALUES
    (1, 'Conversación'),
    (2, 'Gramática'),
    (3, 'Preparación Exámenes de Ingreso'),
    (4, 'Preparación Exámenes Internacionales'),
    (5, 'Talleres de Apoyo');

SELECT * from tipoCursos;


INSERT INTO regularidades VALUES
    (1, 'Regular', 'Este alumno puede rendir exámenes'),
    (2, 'No Regular', 'Este alumno debe rendir exámenes complementarios');

SELECT * from regularidades;


INSERT INTO tipoAnuncios VALUES
    (1, 'Aviso examen'),
    (2, 'Cancelación de clases'),
    (3, 'Evento'), 
    (4, 'Otro');

SELECT * from tipoAnuncios;


INSERT INTO roles VALUES
    ('Alumno'),
    ('Profesor');

SELECT * from roles;

INSERT INTO presentes VALUES
    ('Presente'),
    ('Ausente');

SELECT * from presentes;

--INSERTS VARIABLES

INSERT INTO usuarios VALUES
    (1, 39767395, 'Marcos', 'Guidolin', 'España 650', '2616181199', '39767395', 'Alumno'),
    (2, 20307505, 'Martín', 'Gomez', 'Italia 650', '2616774852', '20307505', 'Profesor');
    (3, 20397682, 'Adriana', 'Lopez', 'Corrientes 60', '26165148795', '20397682', 'Profesor');

SELECT * from usuarios;


INSERT INTO libros VALUES
    (1, 'Grammar For Use 4', 'Cambridge', 2020, 12).
    (2, 'Grammar For Use 2', 'Cambridge', 2010, 10);

SELECT * from libros;


INSERT INTO cursos VALUES 
    (1, 'Adultos Avanzado', 203000, 2023, 'B1', 2, 2, 1),
    (2, 'Niños Intermedio', 180000, 2023, 'A1', 2, 3, 2);

SELECT * from cursos;


INSERT INTO anuncios (id, titulo, descripcion, curso, profesor, tipo)
VALUES 
    (1, 'Fecha examen Final', 'Hemos acordado que el examen final sea el viernes 24/8', 1, 2, 1),
    (2, 'Clases suspendidas 18/5', 'Debido a los cortes de agua, se suspenden las clases del día de mañana', 2, 3, 2);

SELECT * from anuncios;


INSERT INTO asistenciaCursos VALUES
    (1, 1, 1, 0, 2, 2);

SELECT * from asistenciaCursos;


INSERT INTO listaAlumnos VALUES
    (1, 1, 1);

SELECT U.nombre, U.apellido, C.nombre AS curso
FROM  usuarios U, cursos C, listaALumnos L 
WHERE U.id = L.alumno && C.id = L.curso;


INSERT INTO clases (id, tema, curso, unidadUsada, unidadesLibro, presentes, ausentes)
VALUES
    (1, 'Reported Speech', 1, 2, 1, 1, 1);

SELECT DATE_FORMAT(C.fecha,'%d/%m/%Y') AS fecha, C.tema, Q.nombre, C.unidadUsada, L.cantUnidades, C.presentes, C.ausentes
FROM clases C
JOIN cursos AS Q ON Q.id = C.curso
JOIN libros AS L ON L.id = Q.libro;


INSERT INTO cursosdias VALUES
    (1, 1),
    (3, 1);

SELECT C.nombre, C.horario, C.anio, C.nivel, D.dia
FROM cursos C, dias D, cursosdias E
WHERE C.id = E.idCurso && D.id = E.idDia;