var url = "../Modelo/admin.php"; 

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

var appUsuarios = new Vue({
  el: "#appUsuarios", 
  data: {
    users: [], 
    id: "", 
    username: "", 
    password: "",
    email: "", 
  },
  methods: {
    // Método para el boton de alta (crear un nuevo registro)
    btnAlta: async function () {
      const { value: formValues, isDismissed } = await Swal.fire({
        title: 'Nuevo registro',
        html:
          '<div class="row"><label class="col-sm-3 col-form-label">ID</label><div class="col-sm-9"><input id="id" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Username</label><div class="col-sm-9"><input id="username" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Password</label><div class="col-sm-9"><input id="password" type="password" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Email</label><div class="col-sm-9"><input id="email" type="email" class="form-control"></div></div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#3085d6',
        preConfirm: () => {
          return [
            this.id = document.getElementById('id').value,
            this.username = document.getElementById('username').value,
            this.password = document.getElementById('password').value,
            this.email = document.getElementById('email').value
          ]
        }
      })
      if (isDismissed) {
        return; // Si se cancela, no hacer nada
      }
      if (this.id == "" || this.username == "" || this.password == "" || this.email == "") {
        Swal.fire({
          icon: 'info',
          title: 'Datos incompletos',
        })
      }
      else {
        this.altaUsuario();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          icon: 'success',
          title: '¡Usuario Agregado!'
        })
      }
    },
    // Método para el boton de editar (actualizar un registro existente)
    btnEditar: async function (id, username, password, email) {
      await Swal.fire({
        title: 'Registro: ' + id,
        html:
          '<div class="form-group">' +
          '<div class="row"><label class="col-sm-3 col-form-label">ID</label><div class="col-sm-9"><input id="id" value="' + id + '" type="text" class="form-control" readonly></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Username</label><div class="col-sm-9"><input id="username" value="' + username + '" type="text" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Password</label><div class="col-sm-9"><input id="password" value="' + password + '" type="password" class="form-control"></div></div>' +
          '<div class="row"><label class="col-sm-3 col-form-label">Email</label><div class="col-sm-9"><input id="email" value="' + email + '" type="email" class="form-control"></div></div>' +
          '</div>',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonColor: '#1cc88a',
        cancelButtonColor: '#3085d6',
      }).then((result) => {
        if (result.value) {
          const id = document.getElementById('id').value;
          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;
          const email = document.getElementById('email').value;

          this.editarUsuario(id, username, password, email);
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
          this.borrarUsuario(id);
          //y mostramos un msj sobre la eliminacion  
          Swal.fire({
            icon: 'success',
            title: '¡Eliminado!',
            text: 'El registro ha sido borrado.',
            showCancelButton: false,
            showConfirmButton: false,
          }
          )
        }
      })
    },
    // Procedimientos para el CRUD     
    listarUsuarios: function () {
      axios.post(url, { opcion: 4 }).then(response => {
        console.log(response.data); // Verificar la respuesta del servidor
        if (Array.isArray(response.data)) {
          this.users= response.data;
          this.inicializarDataTable(); // Inicializar DataTables después de cargar los datos
        } else {
          console.error("La respuesta del servidor no es un array:", response.data);
        }
      }).catch(error => {
        console.error("Error al listar los usuarios:", error);
      });
    },
    // Procedimiento CREAR.
    altaUsuario: function () {
      axios.post(url, {
        opcion: 1,
        id: this.id,
        username: this.username,
        password: this.password,
        email: this.email
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
          title: '¡Usuario Agregado!'
        });

        // Recargar la página después de 1 segundos
        setTimeout(() => {
          window.location.reload();
        }, 1500); // 1 segundos
      }).catch(error => {
        console.error("Error al agregar el usuario:", error);
      });

      // Resetear los campos después de la insercion
      this.id = "";
      this.username = "";
      this.password = "";
      this.email = "";
    },
    // Procedimiento EDITAR.
    editarUsuario: function (id, username, password, email) {
      axios.post(url, { opcion: 2, id: id, username: username, password: password, email: email }).then(response => {
        this.listarUsuarios();
      });
    },
    // Procedimiento BORRAR.
    borrarUsuario: function (id) {
      axios.post(url, { opcion: 3, id: id }).then(response => {
        this.listarUsuarios();
      });
      // Recargar la página después de 1 segundos
      setTimeout(() => {
        window.location.reload();
      }, 1000); // 1 segundos
    },
    inicializarDataTable: function () {
      this.$nextTick(() => {
        $('#usuariosTable').DataTable().destroy(); // Destruir la instancia existente
        $('#usuariosTable').DataTable({
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
    this.listarUsuarios(); // Llama al método para listar los usuarios cuando se crea la instancia de Vue
  },
  computed: {
    totalUsuarios() {
      return this.users.length;
    }
  }
});