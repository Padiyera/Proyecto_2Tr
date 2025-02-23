<?php
// Habilitar el reporte de errores para depuración
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir el archivo de conexión a la base de datos
include 'conexion.php';

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recibir los datos enviados por JavaScript
    $data = json_decode(file_get_contents('php://input'), true);

    // Verificar si los datos JSON son válidos
    if ($data === null || !isset($data['usuario'])) {
        echo json_encode(['status' => 'error', 'message' => 'Datos JSON inválidos o faltantes']);
        exit();
    }

    $usuario = $data['usuario'];

    // Obtener la fecha y hora actual
    $login_time = date('Y-m-d H:i:s');

    // Crear una instancia de la clase Conexion y obtener la conexión
    $conexion = new Conexion();
    $conn = $conexion->Conectar();

    // Preparar la consulta SQL para insertar el log
    $stmt = $conn->prepare("INSERT INTO user_logs (username, login_time) VALUES (?, ?)");
    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Error al preparar la consulta: ' . $conn->error]);
        exit();
    }

    $stmt->bind_param("ss", $usuario, $login_time);

    // Ejecutar la consulta
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Log insertado correctamente']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Error al insertar el log: ' . $stmt->error]);
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método de solicitud no permitido']);
}
?>