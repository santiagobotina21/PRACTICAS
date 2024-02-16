import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class LlamarDatosService {
  // Define la URL de tu servidor Express donde se encuentra la ruta '/llamar' que definiste en tu servidor.
  private apiUrl = 'http://localhost:3000'; // Ajusta la URL de tu API

  constructor(private http: HttpClient) { }

  obtenerEmpresas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/llamar`);
  }

  eliminarEmpresa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar-empresa/${id}`);
  }

  updateEstado(empresaId: number, nuevoEstado: number): Observable<any> {
    const url = `${this.apiUrl}/cambiar-estado/${empresaId}/${nuevoEstado}`;

    return this.http.put(url, {});
  }

  

  cargarDocumentosPorEmpresa(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documentos-por-empresa/${empresaId}`);
  }

  
  getPdf(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/get-pdf/${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  
  subirArchivo(formData: FormData) {
    return this.http.post(`${this.apiUrl}/cargar-pdf`, formData);
  }

  getPdfR(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/get-pdfr/${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  subirArchivoC(formData: FormData) {
    return this.http.post(`${this.apiUrl}/cargar-pdfc`, formData);
  }

  cargarConvenio(empresaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/convenios/${empresaId}`);
  }

  getPdfC(id: number): Observable<Blob> {
    const url = `${this.apiUrl}/get-pdfc/${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  sendEmail(to: string, subject: string, text: string) {
    const emailData = {
      to: to,
      subject: subject,
      text: text
    };

    return this.http.post('http://localhost:3000/send-email', emailData);
  }

}
