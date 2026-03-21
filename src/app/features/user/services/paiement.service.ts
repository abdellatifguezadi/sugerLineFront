import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaiementResponse, PaiementWithCommande } from '../../../models/paiement.model';
import { environment } from '../../../../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PaiementFilters {
  statut?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PaiementService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/paiements`;

  createPaiement(commandeId: number, montant: number): Observable<PaiementResponse> {
    return this.http.post<PaiementResponse>(this.apiUrl, { commandeId, montant });
  }

  getMyPaiements(filters?: PaiementFilters): Observable<PageResponse<PaiementWithCommande>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.statut) params = params.set('statut', filters.statut);
      if (filters.page != null) params = params.set('page', filters.page.toString());
      if (filters.size != null) params = params.set('size', filters.size.toString());
    }
    return this.http.get<PageResponse<PaiementWithCommande>>(`${this.apiUrl}/my-paiements`, { params });
  }

  getAllPaiements(filters?: PaiementFilters): Observable<PageResponse<PaiementWithCommande>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.statut) params = params.set('statut', filters.statut);
      if (filters.page != null) params = params.set('page', filters.page.toString());
      if (filters.size != null) params = params.set('size', filters.size.toString());
    }
    return this.http.get<PageResponse<PaiementWithCommande>>(this.apiUrl, { params });
  }

  accepterPaiement(id: number): Observable<PaiementResponse> {
    return this.http.patch<PaiementResponse>(`${this.apiUrl}/${id}/accepter`, {});
  }

  annulerPaiement(id: number): Observable<PaiementResponse> {
    return this.http.patch<PaiementResponse>(`${this.apiUrl}/${id}/annuler`, {});
  }
}
