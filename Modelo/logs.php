<?php
include_once 'conexion.php'; // Incluye el archivo de conexión a la base de datos
$objeto = new Conexion(); // Crea una nueva instancia de la clase Conexion
$conexion = $objeto->Conectar(); // Establece la conexión a la base de datos

$_POST = json_decode(file_get_contents("php://input"), true); // Decodifica el JSON recibido
$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : ''; // Obtiene el valor de 'opcion'
$id = (isset($_POST['id'])) ? $_POST['id'] : ''; // Obtiene el valor de 'id'

switch ($opcion) {
    case 1: // Opción 1: Seleccionar todos los registros de la tabla 'user_logs'
        $consulta = "SELECT id, username, login_time FROM user_logs";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data = $resultado->get_result()->fetch_all(MYSQLI_ASSOC);
        break;
    case 2: // Opción 2: Eliminar un registro de la tabla 'user_logs'
        $consulta = "DELETE FROM user_logs WHERE id='$id'";
        $resultado = $conexion->prepare($consulta);
        $resultado->execute();
        $data = []; // No se necesita devolver datos
        break;
}
print json_encode($data, JSON_UNESCAPED_UNICODE); // Codifica el array $data en formato JSON
$conexion = NULL; // Cierra la conexión a la base de datos
