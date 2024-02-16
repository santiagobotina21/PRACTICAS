import { Component } from '@angular/core';
import { LlamarDatosService } from 'services/llamar-datos.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-departamento-juridico',
  templateUrl: './departamento-juridico.component.html',
  styleUrls: ['./departamento-juridico.component.scss']
})
export class DepartamentoJuridicoComponent {

  constructor(private llamarDatosService: LlamarDatosService, private router: Router) { }

  

  redirigirARevisionDocumentos(empresaId: number) {
    // Redirige a la página "revision-documentos" pasando el ID de la empresa como parte de la URL
    this.router.navigate(['/revision-documentos-j', empresaId]);
  }

  empresas: any[] = [];
  empresasContador: number = 0; // Inicializamos el contador en 0

  empresasFiltradas: any[] = [];
  nombreEmpresa: string = '';
 
 
  


  redirigirARectoria(){
    this.router.navigate(['/rectoria']);

  }
  

  // Cargar datos iniciales, puede llamarse en ngOnInit o en otro lugar
  cargarDatosIniciales() {
    this.llamarDatosService.obtenerEmpresas().subscribe(data => {
      this.empresas = data;
      this.empresasFiltradas = this.empresas.filter(empresa => {
        return empresa.estado_id == 2;
      });
       // Inicialmente, ambas listas son iguales
    });
  }

  aplicarFiltros() {
    // Restaurar la lista completa
    this.empresasFiltradas = this.empresas.filter(empresa => {
      return empresa.estado_id == 2;
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
