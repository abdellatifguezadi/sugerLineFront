import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommandeRequest,
  CommandeResponse,
  CommandeUpdate
} from '../../../models/commande.model';
import { environment } from '../../../../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface CommandeFilters {
  statut?: string;
  utilisateurId?: number;
  from?: string;
  to?: string;
  minTotal?: number;
  maxTotal?: number;
  page?: number;
  size?: number;
}

export interface MyCommandeFilters {
  statut?: string;
  from?: string;
  to?: string;
  minTotal?: number;
  maxTotal?: number;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/commandes`;

  createCommande(commande: CommandeRequest): Observable<CommandeResponse> {
    return this.http.post<CommandeResponse>(this.apiUrl, commande);
  }

  getAllCommandes(filters?: CommandeFilters): Observable<PageResponse<CommandeResponse>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.statut) params = params.set('statut', filters.statut);
      if (filters.utilisateurId != null) params = params.set('utilisateurId', filters.utilisateurId.toString());
      if (filters.from) params = params.set('from', filters.from);
      if (filters.to) params = params.set('to', filters.to);
      if (filters.minTotal != null) params = params.set('minTotal', filters.minTotal.toString());
      if (filters.maxTotal != null) params = params.set('maxTotal', filters.maxTotal.toString());
      if (filters.page != null) params = params.set('page', filters.page.toString());
      if (filters.size != null) params = params.set('size', filters.size.toString());
    }
    return this.http.get<PageResponse<CommandeResponse>>(this.apiUrl, { params });
  }

  getCommandeById(id: number): Observable<CommandeResponse> {
    return this.http.get<CommandeResponse>(`${this.apiUrl}/${id}`);
  }

  updateCommande(id: number, commande: CommandeUpdate): Observable<CommandeResponse> {
    return this.http.put<CommandeResponse>(`${this.apiUrl}/${id}`, commande);
  }

  annulerCommande(id: number): Observable<CommandeResponse> {
    return this.http.delete<CommandeResponse>(`${this.apiUrl}/${id}`);
  }

  livrerCommande(id: number): Observable<CommandeResponse> {
    return this.http.patch<CommandeResponse>(`${this.apiUrl}/${id}/livrer`, {});
  }

  getMyCommandes(filters?: MyCommandeFilters): Observable<PageResponse<CommandeResponse>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.statut) params = params.set('statut', filters.statut);
      if (filters.from) params = params.set('from', filters.from);
      if (filters.to) params = params.set('to', filters.to);
      if (filters.minTotal != null) params = params.set('minTotal', filters.minTotal.toString());
      if (filters.maxTotal != null) params = params.set('maxTotal', filters.maxTotal.toString());
      if (filters.page != null) params = params.set('page', filters.page.toString());
      if (filters.size != null) params = params.set('size', filters.size.toString());
    }
    return this.http.get<PageResponse<CommandeResponse>>(`${this.apiUrl}/my-commandes`, { params });
  }
}
