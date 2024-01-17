import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import Swal from 'sweetalert2';
// import { LoginService } from '../../services/login/login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  // Inject the router so we can navigate after a successful login
  constructor(private readonly router: Router,
    private fb: FormBuilder,
    private loginService: LoginService) {
    // Inicializa tu formulario en el constructor

  }

  formLogin = this.fb.group({
    fcn_usuario: ['', [Validators.required]],
    fcn_contasena: ['', Validators.required]
  });

  ngOnInit(): void { }

  public submit() {


    if (this.formLogin.valid) {
      const usuario = this.formLogin.value.fcn_usuario as string;
      const contasena = this.formLogin.value.fcn_contasena as string;

      this.loginService.authenticate(usuario, contasena).subscribe((authenticated) => {
        if (authenticated) {
          // Use the form value to do authentication
          console.log(this.formLogin.value);
          // Navigate after successful login
          this.router.navigate(['/home']);
          // Autenticación exitosa, puedes redirigir o realizar otras acciones
          console.log('Autenticación exitosa');
        } else {
          Swal.fire('Usuario o contraseña incorrectos!', '', 'error');
          this.formLogin.reset();
          // Autenticación fallida, maneja de acuerdo a tus necesidades
          console.log('Autenticación fallida');
        }
      });



    } else {
      this.formLogin.markAllAsTouched();
    }


  }

  /**
   * get
   */
  get fcn_usuario() {
    return this.formLogin.controls.fcn_usuario;
  }
  get fcn_contasena() {
    return this.formLogin.controls.fcn_contasena;
  }
}
