import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StatisticsState } from '../../../models/statistics.model';

export const selectStatisticsState = createFeatureSelector<StatisticsState>('statistics');

export const selectStatisticsData = createSelector(selectStatisticsState, (s) => s.data);
export const selectStatisticsLoading = createSelector(selectStatisticsState, (s) => s.isLoading);
export const selectStatisticsError = createSelector(selectStatisticsState, (s) => s.error);
