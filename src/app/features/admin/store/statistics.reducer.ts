import { createReducer, on } from '@ngrx/store';
import { StatisticsState } from '../../../models/statistics.model';
import * as StatisticsActions from './statistics.actions';

export const initialState: StatisticsState = {
  data: null,
  isLoading: false,
  error: null
};

export const statisticsReducer = createReducer(
  initialState,
  on(StatisticsActions.loadStatistics, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  on(StatisticsActions.loadStatisticsSuccess, (state, { data }) => ({
    data,
    isLoading: false,
    error: null
  })),
  on(StatisticsActions.loadStatisticsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  }))
);
