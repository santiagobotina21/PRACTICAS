import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LlamarDatosService } from 'services/llamar-datos.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-revision-documentos-j',
  templateUrl: './revision-documentos-j.component.html',
  styleUrls: ['./revision-documentos-j.component.scss']
})
export class RevisionDocumentosJComponent {

  empresas: any[] = [];

  empresaId?: number;
  // Almacena el ID de la empresa
  documentos: any[] = []; // Almacena los documentos relacionados con la empresa

  pdfContent: ArrayBuffer = new ArrayBuffer(0);

  checkeados: boolean[] = []; // Array para rastrear si los checks están marcados

  constructor(
    private route: ActivatedRoute,
    private llamarDatosService: LlamarDatosService,
    private router: Router // Asegúrate de importar el servicio real
  ) { }

  regresar() {

    this.router.navigate(['/departamento-juridico']);
  }


  redirigirADocumentosconvenio() {

    this.router.navigate(['/documentos-convenio', this.empresaId]);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.empresaId = +params['empresaId']; // Convierte el valor en número si es necesario
      if (this.empresaId) {
        this.cargarDocumentosPorEmpresa(this.empresaId);
      }
    });

    this.cargarEmpresas();
    this.checkeados = new Array(this.documentos.length).fill(false);
  }

  cargarDocumentosPorEmpresa(empresaId: number) {
    // Llama al servicio para cargar los documentos por empresa
    this.llamarDatosService.cargarDocumentosPorEmpresa(empresaId).subscribe((data: any) => {
      this.documentos = data; // Asigna los documentos relacionados a la propiedad "documentos"

    });
  }

  cargarEmpresas() {
    // Llama al servicio para cargar los documentos por empresa
    this.llamarDatosService.obtenerEmpresas().subscribe(data => {
      this.empresas = data;

    });


  }

  loadPDF(id: number) {
    this.llamarDatosService.getPdf(id).subscribe(pdfData => {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });

  }

  enviarEmail() {

    Swal.fire({
      title: '¿Quieres denegar el convenio?',
      text: "¡Deberás adjuntar los archivos correspondientes y enviar un correo justificando la denegación!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.isConfirmed) {
        const empresaId = this.documentos[0].empresa_id;
        console.log(empresaId);
        this.llamarDatosService.updateEstado(empresaId, 3).subscribe(() => {
          // Actualizar la lista de empresas después de cambiar el estado si es necesario
          this.cargarDatosIniciales();

        });
        const sender = 'jefatura.practicas@unicesmag.edu.co'; // Dirección de correo del remitente
        const gmailComposeURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${sender}`;

        // Abre la URL en una nueva pestaña del navegador
        window.open(gmailComposeURL, '_blank');

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Convenio actualizado correctamente',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })



  }
  enviarARectoria() {
    // Verifica si TODOS los documentos están marcados
    const todosDocumentosMarcados = this.documentos.every(documento => documento.checkeado);
    const nuevoEstado = 4;
    const empresaId = this.documentos[0].empresa_id; // Suponemos que el primer documento tiene el mismo empresa_id que todos

    if (todosDocumentosMarcados) {
      const empresaActual = this.empresas.find(empresa => empresa.id === empresaId);

      if (empresaActual) {
        if (empresaActual.estado_id != 2) {
          Swal.fire({
            title: 'Confirmación',
            text: '¿El estado de la empresa es diferente al de revisión jurídica desea cambiarlo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado'
          }).then((result) => {
            if (result.isConfirmed) {
              // Realiza la actualización del estado solo si el usuario confirmó

              console.log(`Estado cambiado para empresa ID ${empresaId}`);
              // Realiza acciones adicionales si es necesario

              // Añade el código para cargar el archivo PDF aquí
              Swal.fire({
                title: 'Selecciona el documento del convenio. "PDF"',
                html: '<input type="file" id="archivoInput" />',
                showCancelButton: true,
                confirmButtonText: 'Continuar',
                cancelButtonText: 'Cancelar',
              }).then((result) => {
                if (result.isConfirmed) {
                  const archivoInput = document.getElementById('archivoInput') as HTMLInputElement | null;
                  if (archivoInput && archivoInput.files && archivoInput.files.length > 0) {
                    const archivo = archivoInput.files[0];
                    const formData = new FormData();
                    formData.append('archivo', archivo);
                    formData.append('empresaId', empresaId.toString());
                    this.llamarDatosService.updateEstado(empresaId, nuevoEstado).subscribe(response => {

                    // activar y poner el correo correspondiente

                      // const to = 'destinatario@unicesmag.edu.co';
                      // const subject = 'Asunto del correo';
                      // const text = `Cuerpo del correo`;
        
                      // this.llamarDatosService.sendEmail(to, subject, text).subscribe(
                      //   (response) => {
                      //     console.log('Correo enviado exitosamente:', response);
                      //   },
                      //   (error) => {
                      //     console.error('Error al enviar el correo:', error);
                      //   }
                      // );
                    });
                  } else {
                    // No se ha seleccionado ningún archivo
                    Swal.fire('Error', 'No se ha seleccionado ningún archivo.', 'error');
                    return;
                  }
                }
              });

            }
          });
        }
        else {

          // El estado de la empresa ya es el adecuado
          // Añade el código para cargar el archivo PDF directamente aquí
          Swal.fire({
            title: 'Selecciona el documento del convenio. "PDF"',
            html: '<input type="file" id="archivoInput" />',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
              const archivoInput = document.getElementById('archivoInput') as HTMLInputElement | null;
              if (archivoInput && archivoInput.files && archivoInput.files.length > 0) {
                const archivo = archivoInput.files[0];
                const formData = new FormData();
                formData.append('archivo', archivo);
                formData.append('empresaId', empresaId);
                this.llamarDatosService.updateEstado(empresaId, nuevoEstado).subscribe(response => {


                });

                // Llama a la función de subir archivo en tu servicio, enviando el formData
                this.llamarDatosService.subirArchivo(formData).subscribe((resultado) => {
                  // Manejar la respuesta del servicio
                  Swal.fire('Seleccionado', 'Convenio enviado correctamente', 'success');
                });
              } else {
                // No se ha seleccionado ningún archivo
                Swal.fire('Error', 'No se ha seleccionado ningún archivo.', 'error');
              }
            }
          });

        }

      } else {
        // La empresa no se encontró en el arreglo 'empresas'
        console.error(`No se encontró la empresa con ID ${empresaId}`);
      }
    } else {
      // No todos los checkboxes están marcados
      // Muestra un mensaje de error o realiza la acción correspondiente
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Marque todas las casillas!',
      });
    }
  }


  // Cargar datos iniciales, puede llamarse en ngOnInit o en otro lugar
  cargarDatosIniciales() {
    this.llamarDatosService.obtenerEmpresas().subscribe(data => {
      this.empresas = data;
      // Inicialmente, ambas listas son iguales
    });
  }



}
