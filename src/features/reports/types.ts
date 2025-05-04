export interface UberDriverData {
    'Prénom du chauffeur': string
    'Nom du chauffeur': string
    'Adresse e-mail du chauffeur': string,
    'Numéro de téléphone du chauffeur': string,
    'Revenus totaux': string
    'Espèces collectées': string
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
  