import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa tus componentes aquí
import { AppComponent } from './app.component'; // Ajusta esto con tu componente principal
import { RevisionDocumentosComponent } from './revision-documentos/revision-documentos.component'; 
import { RevisionDocumentosJComponent } from './revision-documentos-j/revision-documentos-j.component';
import { JefaturaDePracticasComponent } from './jefatura-de-practicas/jefatura-de-practicas.component';
import { DocumentosConvenioComponent } from './documentos-convenio/documentos-convenio.component';
import { DepartamentoJuridicoComponent } from './departamento-juridico/departamento-juridico.component';
import { RectoriaComponent } from './rectoria/rectoria.component';

import { FormularioComponent } from './formulario/formulario.component';
import { FormularioPdfsComponent } from './formulario-pdfs/formulario-pdfs.component';
import { FormularioPdfs2Component } from './formulario-pdfs2/formulario-pdfs2.component';

import { GraciasComponent } from './gracias/gracias.component';

const routes: Routes = [

  { path: 'jefatura-de-practicas', component: JefaturaDePracticasComponent },

  { path: 'revision-documentos/:empresaId', component: RevisionDocumentosComponent },
  { path: 'revision-documentos-j/:empresaId', component: RevisionDocumentosJComponent },
  { path: 'documentos-convenio/:empresaId', component: DocumentosConvenioComponent },
  { path: 'departamento-juridico', component: DepartamentoJuridicoComponent },
  { path: 'rectoria', component: RectoriaComponent },

  { path: 'formulario', component: FormularioComponent },
  { path: 'formulario-pdfs', component: FormularioPdfsComponent },
  { path: 'formulario-pdfs2', component: FormularioPdfs2Component },
  { path: 'gracias', component: GraciasComponent },

  { path: '', component: JefaturaDePracticasComponent, pathMatch: 'full' }, // Ruta por defecto, ajusta el componente principal

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
