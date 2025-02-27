<?php
class Conexion {
    private $servername = "localhost";
    private $username = "yeraypadial";
    private $password = "srA4#7x14";
    private $dbname = "yeraypadial";
    private $conn;

    public function Conectar() {
        $this->conn = new mysqli($this->servername, $this->username, $this->password, $this->dbname);

        if ($this->conn->connect_error) {
            die("Conexión fallida: " . $this->conn->connect_error);
        }

        $this->conn->set_charset("utf8"); // Establece el conjunto de caracteres a UTF-8

        return $this->conn;
    }
}
?>
