export interface DriverData {
    'UUID du chauffeur': string
    'Prénom du chauffeur': string
    'Nom du chauffeur': string
    'Revenus totaux': string
    'Versements': string
    'Remboursements et notes de frais': string
    'Revenus totaux:Bonus': string
    'Revenus totaux:Autres revenus:Ajustement des frais de service liés aux courses partagées': string
    'Revenus totaux:Autres revenus:Retour d\'un objet oublié': string
    'Montant versé à des tiers': string
  }
  
  export interface BoltDriverData {
    'Driver': string
    'Driver\'s Phone': string
    'Email': string
    'Projected payout|€': string
  }
  
  export interface HeetchData {
    chauffeur: string
    montant: string
  }

  export interface UploadStatus {
    platform: 'uber' | 'bolt' | 'heetch'
    uploaded: boolean
    weekStartDate: string
  }