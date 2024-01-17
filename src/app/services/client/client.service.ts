import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IClient } from '../../interface/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private localStorageKey = 'clients';
  constructor(private http: HttpClient) { }

  getClients(): Observable<IClient[]> {
    const storedClients = localStorage.getItem(this.localStorageKey);
    const clients = storedClients ? JSON.parse(storedClients) : [];
    return of(clients);
  }

  saveClient(clients: IClient) {

    const storedClients = localStorage.getItem(this.localStorageKey);
    const clientes = storedClients ? JSON.parse(storedClients) : [];


    // Obtener el último ID y sumarle 1 si existe
    const lastId = clientes.length > 0 ? clientes[clientes.length - 1].id : 0;
    clients.id = lastId + 1;

    clientes.push(clients);


    localStorage.setItem(this.localStorageKey, JSON.stringify(clientes));

    const response: any = {
      code: 200,
      message: 'Operación exitosa',
    };

    // Devuelve el observable correctamente
    return of(response);
  }


  updateClient(updatedPerson: IClient): Observable<any[]> {
    let clients = this.getStoredclients();


    const index = clients.findIndex((p) => p.id === updatedPerson.id);

    if (index !== -1) {
      // Actualizar la persona en la lista
      clients[index] = updatedPerson;

      // Guardar la lista actualizada en el localStorage
      localStorage.setItem(this.localStorageKey, JSON.stringify(clients));
    }

    // Devolver la lista actualizada como un observable
    return of(clients);
  }

  deleteClient(clientId: number): Observable<any[]> {
    let clients = this.getStoredclients();

    clients = clients.filter((clt) => clt.id !== clientId);

    localStorage.setItem(this.localStorageKey, JSON.stringify(clients));

    return of(clients);
  }

  searchClient(criteria: string): Observable<any[]> {
    let persons = this.getStoredclients();

    persons = persons.filter((person) =>
      person.identification.toString().includes(criteria) ||
      person.nombre.toLowerCase().includes(criteria.toLowerCase()) ||
      person.apellido.toLowerCase().includes(criteria.toLowerCase())
    );

    return of(persons);
  }

  getClientById(cleintId: number): Observable<any> {
    const clients = this.getStoredclients();
    const client = clients.find((p) => p.id === cleintId);
    return of(client);
  }

  private getStoredclients(): any[] {
    const storedClients = localStorage.getItem(this.localStorageKey);
    return storedClients ? JSON.parse(storedClients) : [];
  }


}
