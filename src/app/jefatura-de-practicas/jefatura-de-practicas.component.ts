import { Component } from '@angular/core';
import { LlamarDatosService } from 'services/llamar-datos.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';


@Component({
  selector: 'app-jefatura-de-practicas',
  templateUrl: './jefatura-de-practicas.component.html',
  styleUrls: ['./jefatura-de-practicas.component.scss']
})
export class JefaturaDePracticasComponent {

  constructor(private llamarDatosService: LlamarDatosService, private router: Router) { }

  redirigirARevisionDocumentos(empresaId: number) {
    // Redirige a la página "revision-documentos" pasando el ID de la empresa como parte de la URL
    this.router.navigate(['/revision-documentos', empresaId]);
  }
  redirigirAFormulario() {
    // Redirige a la página "revision-documentos" pasando el ID de la empresa como parte de la URL
    this.router.navigate(['/formulario']);
  }


  empresas: any[] = [];
  empresasContador: number = 0; // Inicializamos el contador en 0

  empresasFiltradas: any[] = [];
  nombreEmpresa: string = '';
  estadoConvenio: string = 'Todos';
  estadoDocumentacion: number = 0;
  tipoEmpresa: string = 'Todos';


  redirigirADepJuridco() {
    this.router.navigate(['/departamento-juridico']);

  }

  enviarEmail(correo: string) {

    // this.cambiarEstado2();

    const sender = correo; // Dirección de correo del remitente
    const gmailComposeURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${sender}`;

    // Abre la URL en una nueva pestaña del navegador
    window.open(gmailComposeURL, '_blank');
  }



  // Cargar datos iniciales, puede llamarse en ngOnInit o en otro lugar
  cargarDatosIniciales() {
    this.llamarDatosService.obtenerEmpresas().subscribe(data => {
      this.empresas = data;
      this.empresasFiltradas = data; // Inicialmente, ambas listas son iguales
    });
  }

  aplicarFiltros() {
    // Restaurar la lista completa
    this.empresasFiltradas = this.empresas;

    // Filtrar por nombre de empresa
    if (this.nombreEmpresa) {
      this.empresasFiltradas = this.empresasFiltradas.filter(empresa => {
        // Cambia "nombre_empresa" por el nombre real del campo en tu objeto empresa
        return empresa.nombre_empresa.toLowerCase().includes(this.nombreEmpresa.toLowerCase());
      });
    }

    if (this.estadoConvenio !== 'Todos') {
      this.empresasFiltradas = this.empresasFiltradas.filter(empresa => {
        return empresa.estado_convenio === this.estadoConvenio;
      });
    }

    if (this.estadoDocumentacion != 0) {
      this.empresasFiltradas = this.empresasFiltradas.filter(empresa => {
        return empresa.estado_id == this.estadoDocumentacion;
      });
    }

    if (this.tipoEmpresa !== 'Todos') {
      this.empresasFiltradas = this.empresasFiltradas.filter(empresa => {
        return empresa.tipo_empresa === this.tipoEmpresa;
      });
    }


  }


  ngOnInit() {
    this.cargarDatosIniciales();
    this.llamarDatosService.obtenerEmpresas().subscribe(empresas => {
      this.empresas = empresas;
      this.empresasContador = this.empresas.length; // Actualiza el contador de empresas

    });

  }



  eliminarEmpresa(empresaId: number) {


    // Mostrar un diálogo de confirmación
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Estás a punto de eliminar un convenio! Esta acción es irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {

        // Llama al servicio para eliminar la empresa en la base de datos
        this.llamarDatosService.eliminarEmpresa(empresaId).subscribe(() => {
          // Elimina la empresa del array local
          this.cargarDatosIniciales();

          Swal.fire('Activado', 'El convenio ha sido eliminado.', 'success');
        });

      }

    });
  }
  onFileSelected(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      // Verificar si se seleccionó un archivo
      if (archivo.size > 5 * 1024 * 1024) {
        // El archivo excede el límite de 5 MB
        Swal.fire('Error', 'El archivo seleccionado excede el límite de tamaño (5 MB).', 'error');
        // Restablecer el valor del input de archivo para permitir una nueva selección
        const archivoInput = document.getElementById('archivoInput') as HTMLInputElement;
        archivoInput.value = '';
      } else {
        // El archivo es válido y no excede el límite de tamaño
        // Puedes realizar las acciones necesarias aquí, como cargarlo o enviarlo al servidor
      }
    }
  }


  cambiarEstado(empresaId: number) {
    // Mostrar un diálogo de confirmación
    // Primero, muestra el cuadro de diálogo de selección de archivo
    Swal.fire({
      title: 'Selecciona el documento consolidado del convenio. "PDF"',
      html: '<input type="file" id="archivoInput" />',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const archivoInput = document.getElementById('archivoInput') as HTMLInputElement | null;
        if (archivoInput && archivoInput.files && archivoInput.files.length > 0) {

          const archivo = archivoInput.files[0];
          const limiteTamanio = 5 * 1024 * 1024; // 5 MB en bytes

          if (archivo.size > limiteTamanio) {
            const empresa = this.empresas.find(e => e.id === empresaId);
            if (empresa) {
              const estado_id = empresa.estado_id;
              console.log(`El estado actual de la empresa es: ${estado_id}`);
              this.llamarDatosService.updateEstado(empresaId, estado_id).subscribe(() => {
                // Actualizar la lista de empresas después de cambiar el estado si es necesario
                this.cargarDatosIniciales();

              });


            }
            Swal.fire('Error', 'El archivo es demasiado grande. Debe ser menor de 5 MB.', 'error');
            return; // No se permite continuar
          }

          console.log(empresaId);

          this.llamarDatosService.updateEstado(empresaId, 6).subscribe(() => {
            // Actualizar la lista de empresas después de cambiar el estado si es necesario
            this.cargarDatosIniciales();

            const formData = new FormData();
            formData.append('archivo', archivo); // Agregar el archivo al formulario
            formData.append('empresaId', empresaId.toString());
  
  
  
            this.llamarDatosService.subirArchivoC(formData).subscribe(() => {

  
  
  
            });

            Swal.fire('Seleccionado', 'Convenio activado correctamente', 'success');

            return;
         
          });


         



        } else {
          // No se ha seleccionado ningún archivo
          Swal.fire('Error', 'No se ha seleccionado ningún archivo.', 'error');

          const empresa = this.empresas.find(e => e.id === empresaId);
          if (empresa) {
            const estado_id = empresa.estado_id;
            console.log(`El estado actual de la empresa es: ${estado_id}`);
            this.llamarDatosService.updateEstado(empresaId, estado_id).subscribe(() => {
              // Actualizar la lista de empresas después de cambiar el estado si es necesario
              this.cargarDatosIniciales();

            });


          }

        }
      }

    });


    const empresa = this.empresas.find(e => e.id === empresaId);
    if (empresa) {
      const estado_id = empresa.estado_id;
      console.log(`El estado actual de la empresa es: ${estado_id}`);
      this.llamarDatosService.updateEstado(empresaId, estado_id).subscribe(() => {
        // Actualizar la lista de empresas después de cambiar el estado si es necesario
        this.cargarDatosIniciales();

      });


    }

  }

  // else {

  //   // Recuperar el estado actual de la empresa y mostrarlo en la consola
  //   const empresa = this.empresas.find(e => e.id === empresaId);
  //   if (empresa) {
  //     const estado_id = empresa.estado_id;
  //     console.log(`El estado actual de la empresa es: ${estado_id}`);
  //     this.llamarDatosService.updateEstado(empresaId, estado_id).subscribe(() => {
  //       // Actualizar la lista de empresas después de cambiar el estado si es necesario
  //       this.cargarDatosIniciales();

  //     });


  //   }
  // }
  cambiarEstado2(empresaId: number) {
    // Mostrar un diálogo de confirmación
    Swal.fire({
      title: 'Estás seguro?',
      text: 'Estás a punto de enviar el conevio a revision por jefatura! El convenio pasara a estado de revisión jefatura de practicas',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, desactivar',
      cancelButtonText: 'No, cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Llamar al servicio para cambiar el estado de la empresa
        this.llamarDatosService.updateEstado(empresaId, 1).subscribe(() => {
          // Actualizar la lista de empresas después de cambiar el estado si es necesario
          this.cargarDatosIniciales();
          Swal.fire('Desactivado', 'El convenio ha sido desactivado.', 'success');


        });
      }

      else {

        // Recuperar el estado actual de la empresa y mostrarlo en la consola
        const empresa = this.empresas.find(e => e.id === empresaId);
        if (empresa) {
          const estado_id = empresa.estado_id;
          console.log(`El estado actual de la empresa es: ${estado_id}`);
          this.llamarDatosService.updateEstado(empresaId, estado_id).subscribe(() => {
            // Actualizar la lista de empresas después de cambiar el estado si es necesario
            this.cargarDatosIniciales();

          });


        }
      }
    });
  }

  // Función para obtener la lista de empresas
  obtenerEmpresas() {
    this.llamarDatosService.obtenerEmpresas().subscribe((empresas) => {
      this.empresas = empresas;
    });
  }

}

