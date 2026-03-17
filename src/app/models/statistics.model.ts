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
  tauxCroissanceRevenu: number;
  tauxCroissanceCommandes: number;
  tauxConversionPaiement: number;
  revenusParMois: StatDataPoint[];
  commandesParMois: StatDataPoint[];
  commandesParStatut: StatDataPoint[];
  paiementsParStatut: StatDataPoint[];
  topProduits: StatDataPoint[];
  beneficesParMois: StatDataPoint[];
  chargesParMois: StatDataPoint[];
  utilisateursParRole: StatDataPoint[];
}

export interface StatisticsState {
  data: AdminStatistics | null;
  isLoading: boolean;
  error: string | null;
}
