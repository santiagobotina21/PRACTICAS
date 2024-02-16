import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JefaturaDePracticasComponent } from './jefatura-de-practicas/jefatura-de-practicas.component';
import { RevisionDocumentosComponent } from './revision-documentos/revision-documentos.component';
import { DocumentosConvenioComponent } from './documentos-convenio/documentos-convenio.component';
import { DepartamentoJuridicoComponent } from './departamento-juridico/departamento-juridico.component';
import { RevisionDocumentosJComponent } from './revision-documentos-j/revision-documentos-j.component';
import { RectoriaComponent } from './rectoria/rectoria.component';
import { FormularioComponent } from './formulario/formulario.component';
import { FormularioPdfsComponent } from './formulario-pdfs/formulario-pdfs.component';
import { FormularioPdfs2Component } from './formulario-pdfs2/formulario-pdfs2.component';
import { GraciasComponent } from './gracias/gracias.component';
import { NavbarComponent } from './navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    JefaturaDePracticasComponent,
    RevisionDocumentosComponent,
    DocumentosConvenioComponent,
    DepartamentoJuridicoComponent,
    RevisionDocumentosJComponent,
    RectoriaComponent,
    FormularioComponent,
    FormularioPdfsComponent,
    FormularioPdfs2Component,
    GraciasComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
