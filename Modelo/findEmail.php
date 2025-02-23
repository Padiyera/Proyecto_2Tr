<?php
include("conexion.php");

$conexion = new Conexion();
$conn = $conexion->Conectar();

if ($conn->connect_error) {
    die(json_encode(array('success' => 0, 'message' => 'Database connection failed')));
}

if (isset($_POST['correo']) && !empty($_POST['correo'])) {
    $correo = $_POST['correo'];

    $query = "SELECT password FROM users WHERE email=?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die(json_encode(array('success' => 0, 'message' => 'Failed to prepare statement')));
    }
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(array('success' => 1, 'message' => 'Correo encontrado', 'password' => $user['password']));
    } else {
        echo json_encode(array('success' => 0, 'message' => 'Correo no encontrado'));
    }
} else {
    echo json_encode(array('success' => 0, 'message' => 'Invalid input'));
}
?>
