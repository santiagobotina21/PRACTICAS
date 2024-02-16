import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-gracias',
  templateUrl: './gracias.component.html',
  styleUrls: ['./gracias.component.scss']
})
export class GraciasComponent {

  constructor(private router: Router,private location: Location) { }


  ngOnInit(): void {
    this.preventBack();
  }

  preventBack(): void {
    history.pushState(null, document.title, location.href);
    this.location.subscribe((popState) => {
      history.pushState(null, document.title, location.href);
    });
  }

  volverAPaginaPrincipal(): void {
    // Redirigir a la página principal (reemplaza '/pagina-principal' con tu ruta real)
    this.router.navigate(['/link-pagina de practicas academicas']);
  }

}
