import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RapportMensuel } from '../../../models/rapport.model';
import { environment } from '../../../../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class RapportService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/rapports`;

  generer(mois: number, annee: number): Observable<RapportMensuel> {
    const params = new HttpParams()
      .set('mois', mois.toString())
      .set('annee', annee.toString());
    return this.http.post<RapportMensuel>(`${this.apiUrl}/generer`, null, { params });
  }

  getById(id: number): Observable<RapportMensuel> {
    return this.http.get<RapportMensuel>(`${this.apiUrl}/${id}`);
  }

  getAll(page = 0, size = 10): Observable<PageResponse<RapportMensuel>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<RapportMensuel>>(this.apiUrl, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
