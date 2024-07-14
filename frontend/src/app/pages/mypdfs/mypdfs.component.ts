import { Component } from '@angular/core';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";
import { MypdfsComponent } from "../../components/pdfs/mypdfs/mypdfs.component";

@Component({
  selector: 'app-mypdfs',
  standalone: true,
  imports: [NavBarComponent, MypdfsComponent],
  templateUrl: './mypdfs.component.html',
  styleUrl: './mypdfs.component.css'
})
export class MypdfsPage {

}
