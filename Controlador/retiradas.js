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

if (!currentUser) {
  // Redirigir al login si no hay usuario actual
  window.location.href = '../index.html';
}

var url = "../Modelo/crud.php"; // URL del archivo PHP que maneja las operaciones CRUD

var appRetiradas = new Vue({
  el: "#appRetiradas", // Elemento HTML donde se monta la instancia de Vue
  data: {
    retiradas: [] // Array para almacenar los registros de retiradas
  },
  methods: {
    listarRetiradas: function () {
      axios.post(url, { opcion: 6 }).then(response => {
        this.retiradas = response.data;
        this.inicializarDataTable();
      }).catch(error => {
        console.error(error);
      });
    },
    inicializarDataTable: function () {
      this.$nextTick(() => {
        $('#retiradasTable').DataTable();
      });
    },
    btnVer: function (retirada) {
      Swal.fire({
        title: 'Detalles de la Retirada',
        html:
          '<div class="row"><label class="col-sm-3 col-form-label">ID</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.idvehiculos + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Nombre</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.nombre + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">NIF</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.nif + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Domicilio</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.domicilio + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Población</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.poblacion + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Provincia</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.provincia + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Permiso</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.permiso + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Fecha</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.fecha + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Agente</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.agente + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Retirada €</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.importeretirada + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Depósito €</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.importedeposito + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Total €</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.total + '" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Opciones de Pago</label><div class="col-sm-9"><input type="text" class="form-control" value="' + retirada.opcionespago + '" readonly></div></div>',
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cerrar',
        cancelButtonColor: '#3085d6',
        showConfirmButton: false
      });
    }
  },
  created: function () {
    this.listarRetiradas();
  }
});