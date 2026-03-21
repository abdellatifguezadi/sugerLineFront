import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { StatisticsService } from '../services/statistics.service';
import { getHttpErrorMessage } from '../../../core/utils/error.utils';
import * as StatisticsActions from './statistics.actions';

@Injectable()
export class StatisticsEffects {
  private actions$ = inject(Actions);
  private statisticsService = inject(StatisticsService);

  loadStatistics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StatisticsActions.loadStatistics),
      switchMap(() =>
        this.statisticsService.getAdminStatistics().pipe(
          map((data) => StatisticsActions.loadStatisticsSuccess({ data })),
          catchError((error) =>
            of(StatisticsActions.loadStatisticsFailure({ error: getHttpErrorMessage(error) }))
          )
        )
      )
    )
  );
}
