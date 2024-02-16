import { Component } from '@angular/core';
import { LlamarDatosService } from 'services/llamar-datos.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-rectoria',
  templateUrl: './rectoria.component.html',
  styleUrls: ['./rectoria.component.scss']
})
export class RectoriaComponent {

  constructor(private llamarDatosService: LlamarDatosService, private router: Router) { }

  enviarEmail( empresaId : number) {

    Swal.fire('No olvide enviar el convenio firmado. ¡Gracias!')

    

    console.log(empresaId);

    this.llamarDatosService.updateEstado(empresaId, 5).subscribe(response => {
      // Una vez completada la actualización, recarga los datos para reflejar el nuevo estado
      this.cargarDatosIniciales();
    });
    
    const sender = 'jefatura.practicas@unicesmag.edu.co' // Dirección de correo del remitente
    const gmailComposeURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${sender}`;
  
    // Abre la URL en una nueva pestaña del navegador
    window.open(gmailComposeURL, '_blank');
  }

  redirigirARevisionDocumentos(id: number) {
    this.llamarDatosService.getPdfR(id).subscribe(pdfData => {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  
  }

  empresas: any[] = [];
  empresasContador: number = 0; // Inicializamos el contador en 0

  empresasFiltradas: any[] = [];
  nombreEmpresa: string = '';
 
 
  



  

  // Cargar datos iniciales, puede llamarse en ngOnInit o en otro lugar
  cargarDatosIniciales() {
    this.llamarDatosService.obtenerEmpresas().subscribe(data => {
      this.empresas = data;
      this.empresasFiltradas = this.empresas.filter(empresa => {
        return empresa.estado_id == 4;
      });
       // Inicialmente, ambas listas son iguales
    });
  }

  aplicarFiltros() {
    // Restaurar la lista completa
    this.empresasFiltradas = this.empresas.filter(empresa => {
      return empresa.estado_id == 4;
    });

    // Filtrar por nombre de empresa
    if (this.nombreEmpresa) {
      this.empresasFiltradas = this.empresasFiltradas.filter(empresa => {
        // Cambia "nombre_empresa" por el nombre real del campo en tu objeto empresa
        return empresa.nombre_empresa.toLowerCase().includes(this.nombreEmpresa.toLowerCase());
      });
    }



  }
  


  ngOnInit() {
    this.cargarDatosIniciales();
    this.llamarDatosService.obtenerEmpresas().subscribe(empresas => {
      this.empresas = empresas;
      this.empresasContador = this.empresas.length; // Actualiza el contador de empresas

    });

    this.aplicarFiltros();

  }



  // Función para obtener la lista de empresas
  obtenerEmpresas() {
    this.llamarDatosService.obtenerEmpresas().subscribe((empresas) => {
      this.empresas = empresas;
    });
  }

}
