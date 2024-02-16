import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { LlamarDatosService } from 'services/llamar-datos.service';

@Component({
  selector: 'app-documentos-convenio',
  templateUrl: './documentos-convenio.component.html',
  styleUrls: ['./documentos-convenio.component.scss']
})
export class DocumentosConvenioComponent {

  empresaId?: number;
  documentos: any = {};
  

  constructor(
    private route: ActivatedRoute, // Asegúrate de importar el servicio real
    private router: Router,
    private llamarDatosService: LlamarDatosService
  ) { }

  regresar() {

    this.router.navigate(['/jefatura-de-practicas']);
  }


  redirigirARevisionDocumentos(id: number) {
    console.log(id);
    this.llamarDatosService.getPdfC(id).subscribe(pdfData => {
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  
  }


  redirigirADoc(){

    this.router.navigate(['/revision-documentos', this.empresaId]);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.empresaId = +params['empresaId']; // Convierte el valor en número si es necesario
   

      if (this.empresaId) {
        // Carga los documentos al inicializar el componente
        this.cargarDocumentos(this.empresaId);
      }
    });


  }


  cargarDocumentos(empresaId: number) {
    this.llamarDatosService.cargarConvenio(empresaId).subscribe((data: any) => {
      this.documentos = data; // Asigna los documentos cargados a la propiedad "documentos"

      console.log(this.documentos );
    });
  }
}

