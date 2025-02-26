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
    },
    btnImprimir: function (retirada) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Add company name and details
      doc.setFontSize(22);
      doc.text('GruasJuan,S.L.', 10, 20);
      doc.setFontSize(12);
      doc.text('Teléfono: 123-456-7890', 140, 20);
      doc.text('Avd.Santa Marta. Nº8', 140, 25);
      doc.text('Email: gruasJuan@empresa.com', 140, 30);

      // Add title
      doc.setFontSize(18);
      doc.text('Factura Simplificada', 10, 50);


      // Add a line under the title
      doc.setLineWidth(0.5);
      doc.line(10, 55, 200, 55);

      // Add content
      doc.setFontSize(12);
      doc.text(`Factura nº: ${retirada.idvehiculos}`, 10, 75);
      doc.text(`Fecha: ${retirada.fecha}`, 10, 85);
      doc.text(`NIF: ${retirada.nif}`, 10, 95);

      // Add a table for the details
      doc.autoTable({
        startY: 100,
        head: [['Descripción', 'Total']],
        body: [
          ['Retirada', `${retirada.importeretirada} €`],
          ['Depósito', `${retirada.importedeposito} €`],
        ],
        theme: 'grid', // Mantiene solo las líneas de la tabla
        styles: {
          lineWidth: 0.1, // Grosor mínimo de las líneas
          lineColor: [0, 0, 0], // Líneas en negro
          fillColor: false, // Desactiva colores de fondo
          textColor: [0, 0, 0], // Texto en negro
        },
        headStyles: {
          fillColor: false, // Sin fondo en el encabezado
          textColor: [0, 0, 0], // Texto en negro
          lineWidth: 0.1, // Línea delgada
          lineColor: [0, 0, 0], // Líneas en negro
        },
        bodyStyles: {
          fillColor: false, // Sin fondo en el cuerpo
          textColor: [0, 0, 0], // Texto en negro
          lineWidth: 0.1, // Línea delgada
          lineColor: [0, 0, 0], // Líneas en negro
        }
      });

      // Add total
      doc.setFontSize(14);
      doc.text(`Total de la retirada: ${retirada.total} €`, 10, doc.autoTable.previous.finalY + 10);
      doc.setFontSize(12);
      doc.text(`Pago mediante: ${retirada.opcionespago} `, 10, doc.autoTable.previous.finalY + 20);

      // Add a footer
      doc.setFontSize(10);
      doc.text('Todos los derechos reservados a GrusJuan,S.L.', 10, 280);

      // Save the PDF
      doc.save(`Factura_${retirada.idvehiculos}.pdf`);
    }
  },
  created: function () {
    this.listarRetiradas();
  }
});