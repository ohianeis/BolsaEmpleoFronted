import { Component } from '@angular/core';
import { Oferta } from "../nuevaOferta/oferta/oferta";
@Component({
  selector: 'app-nueva-oferta',
  standalone: true,

  imports: [
    Oferta
],
  templateUrl: './nueva-oferta.html'
})
export class NuevaOferta   {
 
}