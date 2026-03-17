import { createAction, props } from '@ngrx/store';
import { AdminStatistics } from '../../../models/statistics.model';

export const loadStatistics = createAction('[Statistics] Load');

export const loadStatisticsSuccess = createAction(
  '[Statistics] Load Success',
  props<{ data: AdminStatistics }>()
);

export const loadStatisticsFailure = createAction(
  '[Statistics] Load Failure',
  props<{ error: string }>()
);
