import { ChargesMensuelles } from './charges.model';

export interface RapportMensuel {
  id: number;
  mois: number;
  annee: number;
  chiffreAffaires: number;
  coutTotal: number;
  benefice: number;
  tauxRentabilite: number;
  charges?: ChargesMensuelles;
}
