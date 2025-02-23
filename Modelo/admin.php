<?php
include_once 'conexion.php'; // Incluye el archivo de conexión a la base de datos
$objeto = new Conexion(); // Crea una nueva instancia de la clase Conexion
$conexion = $objeto->Conectar(); // Establece la conexión a la base de datos

$_POST = json_decode(file_get_contents("php://input"), true); // Decodifica el JSON recibido en el cuerpo de la solicitud HTTP y lo convierte en un array asociativo de PHP
$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : ''; // Obtiene el valor de 'opcion' del array $_POST, si no está definido, asigna una cadena vacía
$id = (isset($_POST['id'])) ? $_POST['id'] : ''; // Obtiene el valor de 'id' del array $_POST, si no está definido, asigna una cadena vacía
$username = (isset($_POST['username'])) ? $_POST['username'] : ''; // Obtiene el valor de 'username' del array $_POST, si no está definido, asigna una cadena vacía
$password = (isset($_POST['password'])) ? $_POST['password'] : ''; // Obtiene el valor de 'password' del array $_POST, si no está definido, asigna una cadena vacía
$email = (isset($_POST['email'])) ? $_POST['email'] : ''; // Obtiene el valor de 'email' del array $_POST, si no está definido, asigna una cadena vacía

switch ($opcion) { // Evalúa la variable $opcion para determinar qué operación realizar
    case 1: // Opción 1: Insertar un nuevo registro en la tabla 'users'
        $consulta = "INSERT INTO users (username, password, email) VALUES('$username', '$password', '$email')";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->execute(); // Ejecuta la consulta
        break;
    case 2: // Opción 2: Actualizar un registro existente en la tabla 'users'
        $consulta = "UPDATE users SET username='$username', password='$password', email='$email' WHERE id='$id'";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->execute(); // Ejecuta la consulta
        break;
    case 3: // Opción 3: Eliminar un registro de la tabla 'users'
        $consulta = "DELETE FROM users WHERE id='$id'";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->execute(); // Ejecuta la consulta
        break;
    case 4: // Opción 4: Seleccionar todos los registros de la tabla 'users'
        $consulta = "SELECT id, username, password, email FROM users";
        $resultado = $conexion->prepare($consulta); // Prepara la consulta SQL
        $resultado->execute(); // Ejecuta la consulta
        $data = $resultado->get_result()->fetch_all(MYSQLI_ASSOC); // Obtiene todos los resultados de la consulta en un array asociativo
        break;
}
print json_encode($data, JSON_UNESCAPED_UNICODE); // Codifica el array $data en formato JSON y lo imprime
$conexion = NULL; // Cierra la conexión a la base de datos
?>