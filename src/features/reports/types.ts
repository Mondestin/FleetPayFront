export interface DriverData {
    'UUID du chauffeur': string
    'Prénom du chauffeur': string
    'Nom du chauffeur': string
    'Revenus totaux': string
    'Versements': string
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