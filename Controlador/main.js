var url = "../Modelo/crud.php"; // URL del archivo PHP que maneja las operaciones CRUD

// URL del archivo PHP que maneja las operaciones de logs
var urlLogs = "../Modelo/logs.php";

// Función para registrar acciones de los usuarios
function logAction(currentUser, action) {
  if (!currentUser) {
    console.error('Error: No hay usuario actual');
    return;
  }

  axios.post(urlLogs, {
    opcion: 3, // Opción para insertar un nuevo log
    username: currentUser,
    action: action
  }).then(response => {
    console.log('Respuesta completa del servidor:', response);
    if (response.data && response.data.status === 'success') {
      console.log('Log de acción guardado correctamente:', response.data.message);
    } else {
      console.error('Error al guardar el log de acción:', response.data ? response.data.message : 'Respuesta inesperada del servidor');
    }
  }).catch(error => {
    console.error('Error al guardar el log de acción:', error);
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      console.error('Respuesta del servidor:', error.response.data);
      console.error('Estado HTTP:', error.response.status);
      console.error('Cabeceras:', error.response.headers);
    } else if (error.request) {
      // No se recibió respuesta del servidor
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      // Error al configurar la solicitud
      console.error('Error al configurar la solicitud:', error.message);
    }
    console.error('Configuración de la solicitud:', error.config);
  });
}

function getCookie(name) {
  let cookieArr = document.cookie.split(";");
  for (let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");
    if (name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

var currentUser = getCookie('currentUser');
console.log('Usuario actual:', currentUser);

var appVehiculos = new Vue({
  el: "#appVehiculos", // Elemento HTML donde se monta la instancia de Vue
  data: {
    vehiculos: [], // Array para almacenar los registros de vehículos
    id: "", // Campo para el ID del vehículo
    fechaentrada: "", // Campo para la fecha de entrada del vehículo
    fechasalida: "", // Campo para la fecha de salida del vehículo
    lugar: "", // Campo para el lugar del vehículo
    direccion: "", // Campo para la direccion del vehículo
    agente: "", // Campo para el agente del vehículo
    matricula: "", // Campo para la matrícula del vehículo
    marca: "", // Campo para la marca del vehículo
    modelo: "", // Campo para el modelo del vehículo
    color: "", // Campo para el color del vehículo
    motivo: "", // Campo para el motivo del vehículo
    tipovehiculo: "", // Campo para el tipo de vehículo
    grua: "", // Campo para la grúa del vehículo
    estado: "" // Campo para el estado del vehículo
  },
  methods: {
    // Método para el boton de alta (crear un nuevo registro)
    btnAlta: async function () {
      const { value: formValues, isDismissed } = await Swal.fire({
        title: 'Nuevo registro',
        html:
          '<div class="row"><label class="col-sm-3 col-form-label">ID</label><div class="col-sm-9"><input id="id" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Entrada</label><div class="col-sm-9"><input id="fechaentrada" type="datetime-local" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Salida</label><div class="col-sm-9"><input id="fechasalida" type="datetime-local" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Lugar</label><div class="col-sm-9"><input id="lugar" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Direccion</label><div class="col-sm-9"><input id="direccion" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Agente</label><div class="col-sm-9"><input id="agente" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Matrícula</label><div class="col-sm-9"><input id="matricula" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Marca</label><div class="col-sm-9"><input id="marca" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Modelo</label><div class="col-sm-9"><input id="modelo" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Color</label><div class="col-sm-9"><input id="color" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Motivo</label><div class="col-sm-9"><input id="motivo" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Tipo Vehículo</label><div class="col-sm-9"><select id="tipovehiculo" class="form-control"><option value="Motocicleta, aperos, motocarros y similares">Motocicleta, aperos, motocarros y similares</option><option value="Turismo hasta 12 cv o Remolques hasta 750 kg">Turismo hasta 12 cv o Remolques hasta 750 kg</option><option value="Turismos más de 12 cv o Remolques más de 750 kg">Turismos más de 12 cv o Remolques más de 750 kg</option><option value="Vehículos especiales">Vehículos especiales</option><option value="Vehículos de cortesía">Vehículos de cortesía</option><option value="Chatarra">Chatarra</option></select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Grua</label><div class="col-sm-9"><select id="grua" class="form-control"><option value="Grua H01">Grua H01</option><option value="Grua H02">Grua H02</option><option value="Grua H03">Grua H03</option></select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Estado</label><div class="col-sm-9"><select id="estado" class="form-control"><option value="Liquidado">Liquidado</option><option value="En deposito">En deposito</option></select></div></div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#3085d6',
        preConfirm: () => {
          return [
            this.id = document.getElementById('id').value,
            this.fechaentrada = document.getElementById('fechaentrada').value,
            this.fechasalida = document.getElementById('fechasalida').value,
            this.lugar = document.getElementById('lugar').value,
            this.direccion = document.getElementById('direccion').value,
            this.agente = document.getElementById('agente').value,
            this.matricula = document.getElementById('matricula').value,
            this.marca = document.getElementById('marca').value,
            this.modelo = document.getElementById('modelo').value,
            this.color = document.getElementById('color').value,
            this.motivo = document.getElementById('motivo').value,
            this.tipovehiculo = document.getElementById('tipovehiculo').value,
            this.grua = document.getElementById('grua').value,
            this.estado = document.getElementById('estado').value
          ]
        }
      })
      if (isDismissed) {
        return; // Si se cancela, no hacer nada
      }
      if (this.id == "" || this.fechaentrada == "" || this.fechasalida == "" || this.lugar == "" || this.direccion == "" || this.agente == "" || this.matricula == "" || this.marca == "" || this.modelo == "" || this.color == "" || this.motivo == "" || this.tipovehiculo == "" || this.grua == "" || this.estado == "") {
        Swal.fire({
          icon: 'info',
          title: 'Datos incompletos',
        })
      }
      else {
        this.altaVehiculo();
        logAction(currentUser, 'Ingresar vehículo'); // Registrar la acción
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: 'success',
          title: '¡Vehículo Agregado!'
        })
      }
    },
    // Método para el boton de editar (actualizar un registro existente)
    btnEditar: async function (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) {
      await Swal.fire({
        title: 'Registro: ' + id,
        html:
          '<div class="form-group">' +
          '<div class="row"><label class="col-sm-3 col-form-label">ID</label><div class="col-sm-9"><input id="id" value="' + id + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Entrada</label><div class="col-sm-9"><input id="fechaentrada" value="' + fechaentrada + '" type="datetime-local" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Salida</label><div class="col-sm-9"><input id="fechasalida" value="' + fechasalida + '" type="datetime-local" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Lugar</label><div class="col-sm-9"><input id="lugar" value="' + lugar + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Direccion</label><div class="col-sm-9"><input id="direccion" value="' + direccion + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Agente</label><div class="col-sm-9"><input id="agente" value="' + agente + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Matrícula</label><div class="col-sm-9"><input id="matricula" value="' + matricula + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Marca</label><div class="col-sm-9"><input id="marca" value="' + marca + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Modelo</label><div class="col-sm-9"><input id="modelo" value="' + modelo + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Color</label><div class="col-sm-9"><input id="color" value="' + color + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Motivo</label><div class="col-sm-9"><input id="motivo" value="' + motivo + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Tipo Vehículo</label><div class="col-sm-9"><select id="tipovehiculo" class="form-control">' +
          '<option value="Motocicleta, aperos, motocarros y similares"' + (tipovehiculo === 'Motocicleta, aperos, motocarros y similares' ? ' selected' : '') + '>Motocicleta, aperos, motocarros y similares</option>' +
          '<option value="Turismo hasta 12 cv o Remolques hasta 750 kg"' + (tipovehiculo === 'Turismo hasta 12 cv o Remolques hasta 750 kg' ? ' selected' : '') + '>Turismo hasta 12 cv o Remolques hasta 750 kg</option>' +
          '<option value="Turismos más de 12 cv o Remolques más de 750 kg"' + (tipovehiculo === 'Turismos más de 12 cv o Remolques más de 750 kg' ? ' selected' : '') + '>Turismos más de 12 cv o Remolques más de 750 kg</option>' +
          '<option value="Vehículos especiales"' + (tipovehiculo === 'Vehículos especiales' ? ' selected' : '') + '>Vehículos especiales</option>' +
          '<option value="Vehículos de cortesía"' + (tipovehiculo === 'Vehículos de cortesía' ? ' selected' : '') + '>Vehículos de cortesía</option>' +
          '<option value="Chatarra"' + (tipovehiculo === 'Chatarra' ? ' selected' : '') + '>Chatarra</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Grua</label><div class="col-sm-9"><select id="grua" class="form-control">' +
          '<option value="Grua H01"' + (grua === 'Grua H01' ? ' selected' : '') + '>Grua H01</option>' +
          '<option value="Grua H02"' + (grua === 'Grua H02' ? ' selected' : '') + '>Grua H02</option>' +
          '<option value="Grua H03"' + (grua === 'Grua H03' ? ' selected' : '') + '>Grua H03</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Estado</label><div class="col-sm-9"><select id="estado" class="form-control">' +
          '<option value="Liquidado"' + (estado === 'Liquidado' ? ' selected' : '') + '>Liquidado</option>' +
          '<option value="En deposito"' + (estado === 'En deposito' ? ' selected' : '') + '>En deposito</option>' +
          '</select></div></div>' +
          '</div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#3085d6',
      }).then((result) => {
        if (result.value) {
          const id = document.getElementById('id').value;
          const fechaentrada = document.getElementById('fechaentrada').value;
          const fechasalida = document.getElementById('fechasalida').value;
          const lugar = document.getElementById('lugar').value;
          const direccion = document.getElementById('direccion').value;
          const agente = document.getElementById('agente').value;
          const matricula = document.getElementById('matricula').value;
          const marca = document.getElementById('marca').value;
          const modelo = document.getElementById('modelo').value;
          const color = document.getElementById('color').value;
          const motivo = document.getElementById('motivo').value;
          const tipovehiculo = document.getElementById('tipovehiculo').value;
          const grua = document.getElementById('grua').value;
          const estado = document.getElementById('estado').value;

          this.editarVehiculo(id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado);
          logAction(currentUser, 'Editar vehículo'); // Registrar la acción
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'El registro ha sido actualizado.'
          });
        }
      });

    },
    // Método para el boton de borrar (eliminar un registro)
    btnBorrar: function (id) {
      Swal.fire({
        title: '¿Está seguro de borrar el registro: ' + id + " ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
      }).then((result) => {
        if (result.value) {
          this.borrarVehiculo(id);
          logAction(currentUser, 'Eliminar vehículo');
          //y mostramos un msj sobre la eliminacion  
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido borrado.',
            'success'
          )
        }
      })
    },
    // Método para ver los detalles de un vehículo
    btnVer: async function (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) {
      await Swal.fire({
        title: 'Registro: ' + id,
        html:
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Entrada</label><div class="col-sm-9"><input id="fechaentrada" value="' + fechaentrada + '" type="datetime-local" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha Salida</label><div class="col-sm-9"><input id="fechasalida" value="' + fechasalida + '" type="datetime-local" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Lugar</label><div class="col-sm-9"><input id="lugar" value="' + lugar + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Direccion</label><div class="col-sm-9"><input id="direccion" value="' + direccion + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Agente</label><div class="col-sm-9"><input id="agente" value="' + agente + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Matrícula</label><div class="col-sm-9"><input id="matricula" value="' + matricula + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Marca</label><div class="col-sm-9"><input id="marca" value="' + marca + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Modelo</label><div class="col-sm-9"><input id="modelo" value="' + modelo + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Color</label><div class="col-sm-9"><input id="color" value="' + color + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Motivo</label><div class="col-sm-9"><input id="motivo" value="' + motivo + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Tipo Vehículo</label><div class="col-sm-9"><select id="tipovehiculo" class="form-control" disabled>' +
          '<option value="Motocicleta, aperos, motocarros y similares"' + (tipovehiculo === 'Motocicleta, aperos, motocarros y similares' ? ' selected' : '') + '>Motocicleta, aperos, motocarros y similares</option>' +
          '<option value="Turismo hasta 12 cv o Remolques hasta 750 kg"' + (tipovehiculo === 'Turismo hasta 12 cv o Remolques hasta 750 kg' ? ' selected' : '') + '>Turismo hasta 12 cv o Remolques hasta 750 kg</option>' +
          '<option value="Turismos más de 12 cv o Remolques más de 750 kg"' + (tipovehiculo === 'Turismos más de 12 cv o Remolques más de 750 kg' ? ' selected' : '') + '>Turismos más de 12 cv o Remolques más de 750 kg</option>' +
          '<option value="Vehículos especiales"' + (tipovehiculo === 'Vehículos especiales' ? ' selected' : '') + '>Vehículos especiales</option>' +
          '<option value="Vehículos de cortesía"' + (tipovehiculo === 'Vehículos de cortesía' ? ' selected' : '') + '>Vehículos de cortesía</option>' +
          '<option value="Chatarra"' + (tipovehiculo === 'Chatarra' ? ' selected' : '') + '>Chatarra</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Grua</label><div class="col-sm-9"><select id="grua" class="form-control" disabled>' +
          '<option value="Grua H01"' + (grua === 'Grua H01' ? ' selected' : '') + '>Grua H01</option>' +
          '<option value="Grua H02"' + (grua === 'Grua H02' ? ' selected' : '') + '>Grua H02</option>' +
          '<option value="Grua H03"' + (grua === 'Grua H03' ? ' selected' : '') + '>Grua H03</option>' +
          '</select></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Estado</label><div class="col-sm-9"><select id="estado" class="form-control" disabled>' +
          '<option value="Liquidado"' + (estado === 'Liquidado' ? ' selected' : '') + '>Liquidado</option>' +
          '<option value="En deposito"' + (estado === 'En deposito' ? ' selected' : '') + '>En deposito</option>' +
          '</select></div></div>',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        cancelButtonColor: '#3085d6',
        // confirmButtonText: 'OK',
        // confirmButtonColor: '#1cc88a'
        showConfirmButton: false
      });
      logAction(currentUser, 'Ver vehículo');
    },
    // Procedimientos para el CRUD     
    listarVehiculos: function () {
      axios.post(url, { opcion: 4 }).then(response => {
        console.log(response.data); // Verificar la respuesta del servidor
        if (Array.isArray(response.data)) {
          this.vehiculos = response.data;
          this.inicializarDataTable(); // Inicializar DataTables después de cargar los datos
        } else {
          console.error("La respuesta del servidor no es un array:", response.data);
        }
      }).catch(error => {
        console.error("Error al listar los vehículos:", error);
      });
    },
    // Procedimiento CREAR.
    altaVehiculo: function () {
      axios.post(url, {
        opcion: 1,
        id: this.id,
        fechaentrada: this.fechaentrada,
        fechasalida: this.fechasalida,
        lugar: this.lugar,
        direccion: this.direccion,
        agente: this.agente,
        matricula: this.matricula,
        marca: this.marca,
        modelo: this.modelo,
        color: this.color,
        motivo: this.motivo,
        tipovehiculo: this.tipovehiculo,
        grua: this.grua,
        estado: this.estado
      }).then(response => {
        // Mostrar notificacion de éxito
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500, // Mostrar el mensaje durante 1 segundos
          timerProgressBar: true // Mostrar una barra de progreso
        });
        Toast.fire({
          icon: 'success',
          title: '¡Vehículo Agregado!'
        });

        // Recargar la página después de 1 segundos
        setTimeout(() => {
          window.location.reload();
        }, 1500); // 1 segundos
      }).catch(error => {
        console.error("Error al agregar el vehículo:", error);
      });

      // Resetear los campos después de la insercion
      this.id = "";
      this.fechaentrada = "";
      this.fechasalida = "";
      this.lugar = "";
      this.direccion = "";
      this.agente = "";
      this.matricula = "";
      this.marca = "";
      this.modelo = "";
      this.color = "";
      this.motivo = "";
      this.tipovehiculo = "";
      this.grua = "";
      this.estado = "";
    },
    // Procedimiento EDITAR.
    editarVehiculo: function (id, fechaentrada, fechasalida, lugar, direccion, agente, matricula, marca, modelo, color, motivo, tipovehiculo, grua, estado) {
      axios.post(url, { opcion: 2, id: id, fechaentrada: fechaentrada, fechasalida: fechasalida, lugar: lugar, direccion: direccion, agente: agente, matricula: matricula, marca: marca, modelo: modelo, color: color, motivo: motivo, tipovehiculo: tipovehiculo, grua: grua, estado: estado }).then(response => {
        this.listarVehiculos();
      });
    },
    // Procedimiento BORRAR.
    borrarVehiculo: function (id) {
      axios.post(url, { opcion: 3, id: id }).then(response => {
        this.listarVehiculos();
      });
    },
    inicializarDataTable: function () {
      this.$nextTick(() => {
        $('#vehiculosTable').DataTable().destroy(); // Destruir la instancia existente
        $('#vehiculosTable').DataTable({
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          responsive: true,
          scrollY: '500px', // Altura fija para el scroll vertical
          scrollCollapse: true, // Colapsar espacio vacío
          autoWidth: false, // Desactivar el ajuste automático del ancho de las columnas
          scrollX: false // Desactivar el scroll horizontal
        });
      });
    }
  },
  created: function () {
    this.listarVehiculos(); // Llama al método para listar los vehículos cuando se crea la instancia de Vue
  },
  computed: {
    totalVehiculos() {
      return this.vehiculos.length;
    }
  }
});