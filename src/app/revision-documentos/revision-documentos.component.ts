import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LlamarDatosService } from 'services/llamar-datos.service';
import { Router } from '@angular/router';




import Swal from 'sweetalert2'


@Component({
  selector: 'app-revision-documentos',
  templateUrl: './revision-documentos.component.html',
  styleUrls: ['./revision-documentos.component.scss']
})

export class RevisionDocumentosComponent implements OnInit {

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

    this.router.navigate(['/jefatura-de-practicas']);
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
  enviarAJuridica() {


    // Verifica si TODOS los documentos están marcados
    const todosDocumentosMarcados = this.documentos.every(documento => documento.checkeado);
    const nuevoEstado = 2;
    const empresaId = this.documentos[0].empresa_id; // Suponemos que el primer documento tiene el mismo empresa_id que todos

    if (todosDocumentosMarcados) {
      const empresaActual = this.empresas.find(empresa => empresa.id === empresaId);

      const nombreEmpresa = empresaActual.nombre_empresa;



      if (empresaActual) {
        if (empresaActual.estado_id != 1) {
          Swal.fire({
            title: 'Confirmación',
            text: '¿El estado de la empresa es diferente al de revisión juridica desea cambiarlo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cambiar estado'
          }).then((result) => {
            if (result.isConfirmed) {
              // Realiza la actualización del estado solo si el usuario confirmó
              this.llamarDatosService.updateEstado(empresaId, nuevoEstado)
                .subscribe(response => {
                  console.log(`Estado cambiado para empresa ID ${empresaId}`);
                  // Realiza acciones adicionales si es necesario
                  Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Documentos enviados a jurídica',
                    showConfirmButton: false,
                    timer: 1500
                  });

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

            }
          });
        } else {
          this.llamarDatosService.updateEstado(empresaId, nuevoEstado)
            .subscribe(response => {
              console.log(`Estado cambiado para empresa ID ${empresaId}`);
              // Realiza acciones adicionales si es necesario
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Documentos enviados a jurídica',
                showConfirmButton: false,
                timer: 1500
              });

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




}





