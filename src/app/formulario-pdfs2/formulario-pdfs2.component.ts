import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistroService } from 'services/registro.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-formulario-pdfs2',
  templateUrl: './formulario-pdfs2.component.html',
  styleUrls: ['./formulario-pdfs2.component.scss']
})
export class FormularioPdfs2Component {

  archivosCargados: boolean[] = [];


  documentos: { id: number, descripcion: string }[] = [];
  estadoArchivos: string[] = ["Por Subir"]; // Un elemento por cada archivo 


  nuevoID: number | undefined; // Inicializado como undefined
  archivosPDF: File[] = [];

  constructor(private route: ActivatedRoute, private registroService: RegistroService, private router: Router) {

    this.documentos = [
      { id: 1, descripcion: 'CERTIFICADO DE EXISTENCIA Y REPRESENTACIÓN LEGAL DE LA ENTIDAD CON QUIEN SE SUSCRIBIRÁ EL CONVENIO,  CON FECHA NO SUPERIOR A 2 MESE (CÁMARA DE COMERCIO)' },
      { id: 2, descripcion: 'REGISTRO ÚNICO TRIBUTARIO  DE LA EMPRESA - RUT' },
      { id: 3, descripcion: 'COPIA CÉDULA CIUDADANÍA DEL REPRESENTANTE LEGAL DE LA ENTIDAD O EMPRESA' },
      { id: 4, descripcion: 'AUTORIZACIÓN O DELEGACIÓN PARA CONTRATAR, EN CASO DE REQUERIR' },
      { id: 5, descripcion: 'SI EL CONVENIO TIENE PRESUPUESTO ECONÓMICO, SE NECESITA EL FORMATO PARA PRESENTAR PROPUESTA DEFORMACIÓN CONTINUA, CON SU RESPECTIVO PRESUPUESTO INSTITUCIONAL' },
      { id: 6, descripcion: 'CERTIFICADO DE ACREDITACIÓN DE IMPLEMENTACIÓN DEL SISTEMA DE SEGURIDAD Y SALUD EN EL TRABAJO (EXPEDIDO POR ARL O POR EL PROFESIONAL EN SGSST QUE IMPLEMENTA, ADJUNTANDO LA LICENCIA: S/ART. 1 DE LA LEY 1562 DE 2012, CAP. 7 TIT.4 PARTE 2 DEL LIBRO DEL DECRETO 1072/215, RES. 0312/2019 ART.25)' },


    ];

    this.estadoArchivos = new Array(this.documentos.length).fill("Por Subir");

    this.archivosCargados = this.documentos.map(() => false);
  }

  seleccionarArchivo(event: any, numeroPDF: number) {
    const archivoSeleccionado = event.target.files[0];
    this.archivosPDF[numeroPDF - 1] = archivoSeleccionado;


    // Verificar el tamaño del archivo
    const maxSizeInBytes = 5242880; // 5 MB en bytes
    if (archivoSeleccionado.size > maxSizeInBytes) {
     
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
