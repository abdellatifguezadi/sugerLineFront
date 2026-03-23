export enum StatutPaiement {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  ANNULE = 'ANNULE'
}

export interface PaiementResponse {
  id: number;
  montant?: number;
  date?: string;
  statut?: StatutPaiement | string;
}

export interface PaiementWithCommande {
  id: number;
  montant?: number;
  date?: string;
  statut?: string;
  commandeId?: number;
  commandeDate?: string;
  commandeTotal?: number;
  utilisateur?: { id: number; username?: string };
  utilisateurUsername?: string;
  client?: string;
}
