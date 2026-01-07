

import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Auth } from '../../../services/auth';
@Component({
  selector: 'app-login',
  imports: [FloatLabelModule, ReactiveFormsModule,InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
 loginForm=new FormGroup({
  email:new FormControl('',[Validators.required, Validators.email]),
  password:new FormControl('',Validators.required)
});
onSubmit(){
  console.log(this.loginForm.value);
  //Auth.login
}
}
