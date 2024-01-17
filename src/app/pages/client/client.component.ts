import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { ClientService } from '../../services/client/client.service';
import Swal from 'sweetalert2';
import { IClient } from '../../interface/client.interface';
import { catchError, debounceTime, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent implements OnInit {
  displayStyle = "none";
  @Input() objGetClient: IClient[] | any = [];
  searchTerm?: string;
  ActionBtn: string = 'Guardar';
  longitudMaximaNombre: number = 25;
  longitudMaximaCedula: number = 10;
  longitudMaximaApellido: number = 40;
  longitudMaximaTelefono: number = 10;


  clientForm: IClient = {
    id: 0,
    identification: undefined,
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: undefined
  };

  constructor(
    private clientService: ClientService,
    // private router:Router,
    private fb: FormBuilder
  ) {
    // this.listPerson();
  }

  clientViewForm = this.fb.group({
    fcn_id: [''],
    fcn_identification: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)], [this.validarLongitudMaximaAsync.bind(this, this.longitudMaximaCedula)]],
    fcn_nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)], [this.validarLongitudMaximaAsync.bind(this, this.longitudMaximaNombre)]],
    fcn_apellido: ['',[Validators.required, Validators.pattern(/^[a-zA-Z]+$/)], [this.validarLongitudMaximaAsync.bind(this, this.longitudMaximaApellido)]],
    fcn_direccion: ['', Validators.required],
    fcn_telefono: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)], [this.validarLongitudMaximaAsync.bind(this, this.longitudMaximaTelefono),this.validarNumeroInicio.bind(this)]  ]
  });

  ngOnInit() {
    this.clientViewForm.get('fcn_id')?.setValue('0');
    this.listClients();
  }

  btnAddClients() {
    this.ActionBtn = 'Guardar';
    this.clientViewForm.reset();
    this.clientViewForm.get('fcn_id')?.setValue('0');
    this.displayStyle = "block";
  }

  btnClearSearch() {
    this.searchTerm = '';
    this.listClients();
  }
  btnSearchClient() {
    const ptrBuscar = this.searchTerm as string;
    if (ptrBuscar != "" && ptrBuscar != undefined) {

      this.clientService.searchClient(ptrBuscar.trim()).subscribe({
        next: (rpt: any) => {
          this.objGetClient = rpt;
        },
        error: (e) => {
          console.log(e);
        },
      });
    } else {
      Swal.fire('Debe ingresar un valor a buscar!', '', 'warning');
    }

  }

  closePopup() {
    this.displayStyle = "none";
  }

  clearForm() {
    this.clientViewForm.reset();
    this.clientViewForm.get('fcn_id')?.setValue('0');
  }


  accionEditarGuardar() {

    if (this.clientViewForm.valid) {

      let data = {
        id: this.clientViewForm.get('fcn_id')?.value,
        identification: this.clientViewForm.get('fcn_identification')?.value,
        nombre: this.clientViewForm.get('fcn_nombre')?.value,
        apellido: this.clientViewForm.get('fcn_apellido')?.value,
        direccion: this.clientViewForm.get('fcn_direccion')?.value,
        telefono: this.clientViewForm.get('fcn_telefono')?.value
      };

      if (this.clientForm.id == 0) {
        this.saveClient(data);
      } else {
        this.editClient(data);
      }
      this.listClients();

    } else {
      this.clientViewForm.markAllAsTouched();
    }

  }

  saveClient(data: any) {
    this.clientService.saveClient(data as any).subscribe({
      next: (rpt) => {
        this.clearForm();
        this.closePopup();
      },
      error: (errorData) => {
        console.log(errorData);
        Swal.fire('Error!', '', 'error');
      },
      complete: () => {

        Swal.fire('Guardado!', '', 'success');
      },
    });
    Swal.fire('Guardado!', '', 'success');
  }

  editClient(data: any) {
    this.clientService.updateClient(data as any).subscribe({
      next: (rpt) => {
        this.clearForm();
        this.closePopup();
      },
      error: (errorData) => {
        console.log(errorData);
        Swal.fire('Error!', '', 'error');
      },
      complete: () => {

        Swal.fire('Actualizado!', '', 'success');
      },
    });
    Swal.fire('Actualizado!', '', 'success');
  }

  dataClientRow(data: IClient) {
    // console.log(data);
  }

  btnUpdateClient($event: IClient) {
    this.ActionBtn = 'Actualizar'
    this.displayStyle = "block";

    this.clientService.getClientById($event.id).subscribe({
      next: (rpt) => {
        this.clientForm = rpt;
      },
      error: (errorData) => {
        console.log(errorData);
      },
      complete: () => { },
    });

  }

  listClients() {
    this.clientService.getClients().subscribe({
      next: (rpt: any) => {
        this.objGetClient = rpt;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }


  deleteClientRowConfirm(data: IClient) {
    Swal.fire({
      title: 'Esta seguro de borrar cliente?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Borrar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteClient(data);
      } else if (result.isDenied) {
        Swal.fire('Accion cancelada', '', 'info');
      }
    });
  }

  deleteClient(data: IClient) {
    this.clientService.deleteClient(data.id).subscribe({
      next: (rpt) => {
        this.listClients();
      },
      error: (errorData) => {
        console.log(errorData);
      },
      complete: () => {
        Swal.fire('Persona Borrada!', '', 'success');
      },
    });
  }

  /**
  * get
  */
  get fcn_identification() {
    return this.clientViewForm.controls.fcn_identification;
  }
  get fcn_nombre() {
    return this.clientViewForm.controls.fcn_nombre;
  }
  get fcn_apellido() {
    return this.clientViewForm.controls.fcn_apellido;
  }
  get fcn_direccion() {
    return this.clientViewForm.controls.fcn_direccion;
  }
  get fcn_telefono() {
    return this.clientViewForm.controls.fcn_telefono;
  }
  get fcn_id() {
    return this.clientViewForm.controls.fcn_id;
  }


  async validarLongitudMaximaAsync(longitudMaxima: number,
    control: AbstractControl): Promise<ValidationErrors | null> {
    const valor = control.value;

    if (!valor) {
      return Promise.resolve(null); // Valor vacío, no aplicar la validación
    }

    const esValido = valor.length <= longitudMaxima;

    return esValido ? null : { longitudInvalida: true };
  }


  async validarNumeroInicio(control: AbstractControl): Promise<ValidationErrors | null> {
    const valor = control.value;

    if (!valor) {
      return Promise.resolve(null); // Valor vacío, no aplicar la validación
    }

    const primerosDosDigitos = valor.substring(0, 2);
    if (primerosDosDigitos !== '09') {
      return { numeroInvalido: true };
    }

    return null;
  }


}
