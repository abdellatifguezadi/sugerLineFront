import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminStatistics, UserStatistics } from '../../../models/statistics.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/statistiques`;

  getAdminStatistics(): Observable<AdminStatistics> {
    return this.http.get<AdminStatistics>(`${this.apiUrl}/admin`);
  }

  getMesStatistiques(): Observable<UserStatistics> {
    return this.http.get<UserStatistics>(`${this.apiUrl}/mes-statistiques`);
  }
}
