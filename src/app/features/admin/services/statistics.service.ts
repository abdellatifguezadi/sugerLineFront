import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStatistics } from '../../../models/statistics.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/statistiques`;

  getAdminStatistics(): Observable<AdminStatistics> {
    return this.http.get<AdminStatistics>(`${this.apiUrl}/admin`);
  }
}
