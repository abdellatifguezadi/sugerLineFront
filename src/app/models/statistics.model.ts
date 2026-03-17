export interface StatDataPoint {
  label: string;
  value: number | null;
  count: number | null;
}

export interface AdminStatistics {
  totalCommandes: number;
  totalCommandesEnAttente: number;
  totalCommandesLivrees: number;
  totalCommandesAnnulees: number;
  totalPaiements: number;
  totalPaiementsEnAttente: number;
  totalPaiementsAcceptes: number;
  totalPaiementsAnnules: number;
  totalUtilisateurs: number;
  totalProduits: number;
  totalIngredients: number;
  revenuTotal: number;
  revenuMoisActuel: number;
  revenuMoisPrecedent: number;
  beneficeNet: number;
  chargesTotal: number;
  commandesParStatut: StatDataPoint[];
  paiementsParStatut: StatDataPoint[];
  utilisateursParRole: StatDataPoint[];
  tauxCroissanceRevenu: number;
  tauxConversionPaiement: number;
}

export interface StatisticsState {
  data: AdminStatistics | null;
  isLoading: boolean;
  error: string | null;
}
