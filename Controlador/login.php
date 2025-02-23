<?php
include("../Modelo/conexion.php");

$conexion = new Conexion();
$conn = $conexion->Conectar();

if ($conn->connect_error) {
    die(json_encode(array('success' => 0, 'message' => 'Database connection failed')));
}

if (isset($_POST['usuario']) && !empty($_POST['usuario']) && isset($_POST['password']) && !empty($_POST['password'])) {
    $usuario = $_POST['usuario'];
    $password = $_POST['password'];
    
    $query = "SELECT * FROM users WHERE (username=? OR email=?) AND password=?";
    $stmt = $conn->prepare($query);
    if ($stmt === false) {
        die(json_encode(array('success' => 0, 'message' => 'Failed to prepare statement')));
    }
    $stmt->bind_param("sss", $usuario, $usuario, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(array('success' => 1));
    } else {
        echo json_encode(array('success' => 0));
    }
} else {
    echo json_encode(array('success' => 0, 'message' => 'Invalid input'));
}
?>
