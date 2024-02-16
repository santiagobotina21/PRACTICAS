import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistroService } from 'services/registro.service';
import { LlamarDatosService } from 'services/llamar-datos.service';
import { Router } from '@angular/router';

import { Location } from '@angular/common';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-pdfs',
  templateUrl: './formulario-pdfs.component.html',
  styleUrls: ['./formulario-pdfs.component.scss']
})
export class FormularioPdfsComponent implements OnInit {

  archivosCargados: boolean[] = [];

  documentos: { id: number, descripcion: string }[] = [];
  estadoArchivos: string[] = ["Por Subir"]; // Un elemento por cada archivo 


  nuevoID: number | undefined; // Inicializado como undefined
  archivosPDF: File[] = [];

  constructor(private route: ActivatedRoute, private registroService: RegistroService, private llamarDatosService: LlamarDatosService, private router: Router, private location: Location) {

    this.documentos = [
      { id: 1, descripcion: 'CERTIFICADO DE EXISTENCIA Y REPRESENTACIÓN LEGAL DE LA ENTIDAD CON QUIEN SE SUSCRIBIRÁ EL CONVENIO,  CON FECHA NO SUPERIOR A 2 MESE (CÁMARA DE COMERCIO)' },
      { id: 2, descripcion: 'REGISTRO ÚNICO TRIBUTARIO  DE LA EMPRESA - RUT' },
      { id: 3, descripcion: 'COPIA CÉDULA CIUDADANÍA DEL REPRESENTANTE LEGAL DE LA ENTIDAD O EMPRESA' },
      { id: 4, descripcion: 'AUTORIZACIÓN O DELEGACIÓN PARA CONTRATAR, EN CASO DE REQUERIR' },
      { id: 5, descripcion: 'SI EL CONVENIO TIENE PRESUPUESTO ECONÓMICO, SE NECESITA EL FORMATO PARA PRESENTAR PROPUESTA DEFORMACIÓN CONTINUA, CON SU RESPECTIVO PRESUPUESTO INSTITUCIONAL' },
      { id: 6, descripcion: 'CERTIFICADO DE ACREDITACIÓN DE IMPLEMENTACIÓN DEL SISTEMA DE SEGURIDAD Y SALUD EN EL TRABAJO (EXPEDIDO POR ARL O POR EL PROFESIONAL EN SGSST QUE IMPLEMENTA, ADJUNTANDO LA LICENCIA: S/ART. 1 DE LA LEY 1562 DE 2012, CAP. 7 TIT.4 PARTE 2 DEL LIBRO DEL DECRETO 1072/215, RES. 0312/2019 ART.25)' },
      { id: 7, descripcion: 'ACTA DE POSESIÓN DEL REPRESENTANTE LEGAL DE LA ENTIDAD (PÚBLICA)' },
      { id: 8, descripcion: 'ACTA DE NOMBRAMIENTO DEL REPRESENTANTE LEGAL DE LA ENTIDAD (PÚBLICA)' },
      { id: 9, descripcion: 'DECRETO, LEY, RESOLUCIÓN, EN LA CUAL CONSTE LA FACULTAD DEL REPRESENTANTE LEGAL PARA SUSCRIBIR EL CONVENIO (PÚBLICA)' },

    ];

    this.estadoArchivos = new Array(this.documentos.length).fill("Por Subir");
    // Inicializa archivosCargados con 'false' para cada documento
    this.archivosCargados = this.documentos.map(() => false);


  }



  seleccionarArchivo(event: any, numeroPDF: number) {
    const archivoSeleccionado = event.target.files[0];
    this.archivosPDF[numeroPDF - 1] = archivoSeleccionado;
    // Verificar si el archivo excede el tamaño máximo
    if (archivoSeleccionado.size > 5242880) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El archivo no debe pesar más de 5 MB!',

      })
      return;
    }


    // Cambia el estado a "Cargado" para el archivo seleccionado
    this.estadoArchivos[numeroPDF - 1] = "Cargado";
    this.archivosCargados[numeroPDF - 1] = true;

  }

  getEstadoStyle(estado: string): object {
    if (estado === 'Cargado') {
      return { color: 'green' };
    }
    return {}; // Devuelve un objeto vacío si el estado no es 'Cargado'
  }




  ngOnInit() {
    // Recupera el nuevoID de la ruta actual
    this.route.queryParams.subscribe((params) => {
      this.nuevoID = +params['id']; // Suponiendo que 'id' es el nombre del parámetro en la URL
      console.log(this.nuevoID);
    });
  }



  subirPDFs(): void {

    const todosArchivosCargados = this.archivosCargados.every((cargado) => cargado);

    if (!todosArchivosCargados) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Asegúrate de cargar todos los archivos PDF antes de enviar el formulario.',
        
      })
     
      return;
    }

    const formData = new FormData();

    // Agrega el nuevoID al formData
    if (this.nuevoID !== undefined) {
      formData.append('nuevoID', this.nuevoID.toString());
    } else {
      // Manejo de errores o acción alternativa si this.nuevoID es undefined
      console.log(this.nuevoID)
    }


    // Recorrer los archivos en el arreglo y asignarlos a campos individuales en FormData
    for (let i = 0; i < this.archivosPDF.length; i++) {
      formData.append(`pdf${i + 1}`, this.archivosPDF[i]);
    }

    // Supongamos que tienes un objeto FormData llamado 'formData'
    formData.forEach((value: FormDataEntryValue, key: string) => {
      console.log(`Campo: ${key}, Valor: ${value}`);
    });

    this.registroService.subirPDFs(formData).subscribe(
      (response: any) => {
        console.log('Archivos PDF subidos con éxito:', response);
         // activar y poner el correo correspondiente
        
        // const to = 'destinatario@unicesmag.edu.co';
        // const subject = 'Asunto del correo';
        // const text = `Cuerpo del correo `;

        // this.llamarDatosService.sendEmail(to, subject, text).subscribe(
        //   (response) => {
        //     console.log('Correo enviado exitosamente:', response);
        //   },
        //   (error) => {
        //     console.error('Error al enviar el correo:', error);
        //   }
        // );
        // Realizar acciones adicionales después de la carga exitosa
     // Realizar acciones adicionales después de la carga exitosa
     this.router.navigate(['/gracias']);

   
   

      },
      (error: any) => {
        console.error('Error al subir archivos PDF:', error);
        // Manejar el error según tus necesidades
      }
    );
  }




}
