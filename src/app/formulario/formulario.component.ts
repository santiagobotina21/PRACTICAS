import { Component, OnInit } from '@angular/core';

import { tap } from 'rxjs';
import { RegistroService } from 'services/registro.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importa los módulos de Angular Forms


@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent {

  formulario: FormGroup = new FormGroup({});

  onSubmit() {

    console.log('Antes de llamar al servicio');
    this.registroService.getPaises().subscribe((data: any[]) => {
      console.log('Países recibidos:', data);
      this.paises = data;
    });
    console.log('Después de llamar al servicio');

    // Aquí puedes enviar los datos a la API o realizar otras acciones
    console.log('Datos enviados:', this.formData);
  }
  formData = {
    nombreEmpresa: '',
    telefonoFijo: '',
    direccion: '',
    pais: '',
    departamento: '',
    nombreRepresentante: '',
    nit: '',
    telefonoCelular: '',
    correoElectronico: '',
    municipio: '',
    tipoEmpresa: '',
    cedulaRepresentante: '',

    nombreEncargado: '',
    correoElectronicoEncargado: '',
    celularEncargado: ''

  };

  paises: any[] = [];
  departamentos: any[] = [];
  municipios: any[] = [];


  constructor(
    private formBuilder: FormBuilder, // Inyecta FormBuilder
    private registroService: RegistroService,
    private router: Router
  ) { }

  private buildForm() {
    // Define las validaciones para cada campo utilizando Validators de Angular
    this.formulario = this.formBuilder.group({
      nombreEmpresa: ['', Validators.required],
      telefonoFijo: ['', Validators.required],
      direccion: ['', Validators.required],
      pais: ['', Validators.required],
      departamento: ['', Validators.required],
      nombreRepresentante: ['', Validators.required],
      nit: ['', Validators.required],
      telefonoCelular: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      municipio: ['', Validators.required],
      tipoEmpresa: ['', Validators.required],
      cedulaRepresentante: ['', Validators.required],
      nombreEncargado: ['', Validators.required],
      correoElectronicoEncargado: ['', [Validators.required, Validators.email]],
      celularEncargado: ['', Validators.required]
    });
  }

  enviarFormulario() {
    // Verifica si todos los campos requeridos están llenos antes de enviar el formulario
    if (
      this.formData.nombreEmpresa &&
      this.formData.telefonoFijo &&
      this.formData.direccion &&
      this.formData.pais &&
      this.formData.departamento &&
      this.formData.nombreRepresentante &&
      this.formData.nit &&
      this.formData.telefonoCelular &&
      this.formData.correoElectronico &&
      this.formData.municipio &&
      this.formData.tipoEmpresa &&
      this.formData.cedulaRepresentante &&
      this.formData.nombreEncargado &&
      this.formData.correoElectronicoEncargado &&
      this.formData.celularEncargado 
   
      // Agrega verificaciones para otros campos requeridos aquí
    ) {
      // Todos los campos requeridos están llenos, ahora puedes enviar el formulario
      this.registroService.enviarFormulario(this.formData).subscribe(
        (response: any) => {
          console.log('Registro insertado:', response);
          // Obtén el nuevo ID generado en la respuesta
          const nuevoID = response.nuevoID; // Asegúrate de que estás obteniendo el nuevoID de la respuesta
  
          if (nuevoID !== undefined && nuevoID !== null) {

            if (this.formData.tipoEmpresa === 'Pública') {
                // Redirige al usuario a la página del formulario 2 y pasa el ID como parámetro en la URL
            this.router.navigate(['/formulario-pdfs'], { queryParams: { id: nuevoID } });
            }

            if (this.formData.tipoEmpresa === 'Privada') {
              // Redirige al usuario a la página del formulario 2 y pasa el ID como parámetro en la URL
          this.router.navigate(['/formulario-pdfs2'], { queryParams: { id: nuevoID } });
          }

          
          } else {
            console.error('El nuevoID es undefined o null');
          }
        },
        (error: any) => {
          console.error('Error al realizar el registro:', error);
          // Maneja el error según tus necesidades
        }
      );
    } else {
      // Mostrar una alerta o notificación al usuario de que hay campos vacíos
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor complete todos los campos!',
       
      })
    }
  }
  



  cargarPaises() {
    this.registroService.getPaises().subscribe(
      (data: any) => {
        this.paises = data;
      },
      (error) => {
        console.error('Error al cargar los países', error);
      }
    );


  }
  // Función para cargar departamentos según el país seleccionado
  cargarDepartamentosPorPais() {
   
    // Obtén el ID del país seleccionado desde formData.pais (asegúrate de que sea un número)
    const paisIdNumero = Number(this.formData.pais);


    if (!isNaN(paisIdNumero)) {
      this.registroService.getDepartamentosPorPais(paisIdNumero).subscribe(
        (data: any) => {
          this.departamentos = data;
        },
        (error) => {
          console.error('Error al cargar los departamentos', error);
        }
      );
    } else {
      // Maneja el caso en el que formData.pais no sea un número válido
      console.error('ID de país no válido');
    }
  }

  cargarMunicipiosPorDepartamento() {
    // Obtén el ID del país seleccionado desde formData.pais (asegúrate de que sea un número)
    const departamentoIdNumero = Number(this.formData.departamento);

    console.log(departamentoIdNumero);

    if (!isNaN(departamentoIdNumero)) {
      this.registroService.getMunicipiosPorDepartamento(departamentoIdNumero).subscribe(
        (data: any) => {
          this.municipios = data;
        },
        (error) => {
          console.error('Error al cargar los municipios', error);
        }
      );
    } else {
      // Maneja el caso en el que formData.pais no sea un número válido
      console.error('ID de Departamento no válido');
    }
  }


  ngOnInit() {
    // Llamar a la función para cargar los países al inicio
    this.cargarPaises();
    this.buildForm(); // Llama a la función para construir el formulario

  }



}
