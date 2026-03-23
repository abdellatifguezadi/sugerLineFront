import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChargesMensuelles, ChargesMensuellesRequest, ChargesMensuellesUpdate } from '../../../models/charges.model';
import { environment } from '../../../../environments/environment';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ChargesFilters {
  page?: number;
  size?: number;
}

@Injectable({ providedIn: 'root' })
export class ChargesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/charges`;

  create(dto: ChargesMensuellesRequest): Observable<ChargesMensuelles> {
    return this.http.post<ChargesMensuelles>(this.apiUrl, dto);
  }

  update(id: number, dto: ChargesMensuellesUpdate): Observable<ChargesMensuelles> {
    return this.http.put<ChargesMensuelles>(`${this.apiUrl}/${id}`, dto);
  }

  getById(id: number): Observable<ChargesMensuelles> {
    return this.http.get<ChargesMensuelles>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: ChargesFilters): Observable<PageResponse<ChargesMensuelles>> {
    let params = new HttpParams();
    if (filters) {
      if (filters.page != null) params = params.set('page', filters.page.toString());
      if (filters.size != null) params = params.set('size', filters.size.toString());
    }
    return this.http.get<PageResponse<ChargesMensuelles>>(this.apiUrl, { params });
  }
}
