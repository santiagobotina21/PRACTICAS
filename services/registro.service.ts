import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  constructor(private http: HttpClient) { }

  private backendUrl = 'http://localhost:3000';

  enviarFormulario(formData: any): Observable<any> {
    return this.http.post(`${this.backendUrl}/insertar`, formData);
  }

  getPaises(): Observable<any> {
    return this.http.get(`${this.backendUrl}/paises`);
  }

  getDepartamentosPorPais(paisId: number): Observable<any> {
    // Aquí puedes ajustar la URL y los parámetros de la solicitud según tu backend
    return this.http.get(`${this.backendUrl}/departamentos/${paisId}`);
  }

  getMunicipiosPorDepartamento(departamentoId: number): Observable<any> {
    // Aquí puedes ajustar la URL y los parámetros de la solicitud según tu backend
    return this.http.get(`${this.backendUrl}/municipios/${departamentoId}`);
  }


    subirPDFs(formData: FormData): Observable<any> {
      const headers = new HttpHeaders({
        // No es necesario configurar Content-Type aquí
      });

    // Declara un tipo explícito para formDataObject
    const formDataObject: { [key: string]: FormDataEntryValue } = {};

    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
  
    console.log(formDataObject);

      return this.http.post(`${this.backendUrl}/subir-pdfs`, formData, { headers });
    }

  }
