export enum StatutCommande {
  EN_ATTENTE = 'EN_ATTENTE',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

export interface UtilisateurResponse {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  role?: string;
}

export interface PaiementResponse {
  id: number;
  montant?: number;
  date?: string;
  statut?: string;
}

export interface CommandeLineResponse {
  id: number;
  quantite: number;
  produit: string;
  total: number;
}

export interface CommandeResponse {
  id: number;
  date: string;
  statut: StatutCommande;
  utilisateur: UtilisateurResponse;
  commandeLines: CommandeLineResponse[];
  paiement?: PaiementResponse | null;
  montantAvantReduction: number;
  pourcentageReduction: number;
  montantReduction: number;
  total: number;
}

export interface CommandeLineRequest {
  quantite: number;
  produitId: number;
}

export interface CommandeRequest {
  date: string;
  utilisateurId?: number;
  commandeLines: CommandeLineRequest[];
}

export interface CommandeUpdate {
  date: string;
  commandeLines: CommandeLineRequest[];
}
