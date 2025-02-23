<?php
include_once 'conexion.php'; // Incluye el archivo de conexión a la base de datos
$objeto = new Conexion(); // Crea una nueva instancia de la clase Conexion
$conexion = $objeto->Conectar(); // Establece la conexión a la base de datos

// Decodificar el JSON recibido
$_POST = json_decode(file_get_contents("php://input"), true);

// Obtener los datos enviados desde el frontend
$opcion = (isset($_POST['opcion'])) ? $_POST['opcion'] : '';
$username = (isset($_POST['username'])) ? $_POST['username'] : '';
$action = (isset($_POST['action'])) ? $_POST['action'] : '';

// Inicializar la variable de respuesta
$data = ['status' => 'error', 'message' => 'Opción no válida'];

switch ($opcion) {
    case 1: // Seleccionar todos los registros
        $consulta = "SELECT id, username, login_time, action FROM user_logs";
        $resultado = $conexion->prepare($consulta);
        if ($resultado->execute()) {
            $data = $resultado->get_result()->fetch_all(MYSQLI_ASSOC);
        } else {
            $data = ['status' => 'error', 'message' => 'Error al obtener los logs'];
        }
        break;

    case 2: // Eliminar un registro
        $id = (isset($_POST['id'])) ? $_POST['id'] : '';
        $consulta = "DELETE FROM user_logs WHERE id='$id'";
        $resultado = $conexion->prepare($consulta);
        if ($resultado->execute()) {
            $data = ['status' => 'success', 'message' => 'Log eliminado correctamente'];
        } else {
            $data = ['status' => 'error', 'message' => 'Error al eliminar el log'];
        }
        break;

        case 3: // Insertar un nuevo log
            // Verificar si el username existe en la tabla users
            $consulta_verificar = "SELECT username FROM users WHERE username = '$username'";
            $resultado_verificar = $conexion->query($consulta_verificar);
            if ($resultado_verificar->num_rows > 0) {
                // El username existe, proceder con la inserción
                $consulta = "INSERT INTO user_logs (username, login_time, action) VALUES ('$username', NOW(), '$action')";
                $resultado = $conexion->prepare($consulta);
                if ($resultado->execute()) {
                    $data = ['status' => 'success', 'message' => 'Log guardado correctamente'];
                } else {
                    $data = ['status' => 'error', 'message' => 'Error al guardar el log: ' . $conexion->error];
                }
            } else {
                // El username no existe
                $data = ['status' => 'error', 'message' => 'El usuario no existe en la tabla users'];
            }
            break;
    }

// Enviar la respuesta en formato JSON
print json_encode($data, JSON_UNESCAPED_UNICODE);

// Cerrar la conexión a la base de datos
$conexion = NULL;
?>