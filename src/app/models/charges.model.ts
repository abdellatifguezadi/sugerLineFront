export interface ChargesMensuelles {
  id: number;
  mois: number;
  annee: number;
  chargesVariables: number;
  electricite: number;
  eau: number;
  salaires: number;
  loyer: number;
  autres: number;
  total: number;
  utilisateurUsername: string;
}

export interface ChargesMensuellesRequest {
  mois: number;
  annee: number;
  electricite: number;
  eau: number;
  salaires: number;
  loyer: number;
  autres?: number;
}

export interface ChargesMensuellesUpdate {
  electricite?: number;
  eau?: number;
  salaires?: number;
  loyer?: number;
  autres?: number;
}
