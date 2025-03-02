# FleetPay Dashboard

Application web de gestion des revenus des chauffeurs VTC, permettant l'importation et l'analyse des données depuis plusieurs plateformes (Bolt, Uber, Heetch).

## Fonctionnalités

### Gestion des Revenus
- **Import Multi-Plateformes**
  - Import CSV pour Bolt avec validation des données
  - Import CSV pour Uber avec validation des données
  - Import PDF pour Heetch avec extraction automatique
- **Rapports de Paiement**
  - Suivi hebdomadaire des revenus
  - Calcul automatique des commissions
  - État des paiements (payé/en attente)

### Gestion des Utilisateurs
- Contrôle d'accès basé sur les rôles (User, Manager, Admin, Superadmin)
- Gestion des statuts utilisateurs (Actif/Inactif)
- Système d'authentification sécurisé

### Interface Utilisateur
- Design responsive
- Mode sombre/clair
- Tables de données interactives
- Retour en temps réel sur les validations
- Barre de recherche globale
- Sidebar personnalisable

## Stack Technique

**Frontend:**
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- [ShadcnUI](https://ui.shadcn.com) (TailwindCSS + RadixUI)
- [TypeScript](https://www.typescriptlang.org/)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

**Outils:**
- [PapaParse](https://www.papaparse.com/) (Parsing CSV)
- [PDF.js](https://mozilla.github.io/pdf.js/) (Traitement PDF)
- [Tabler Icons](https://tabler.io/icons)
- [Eslint](https://eslint.org/) & [Prettier](https://prettier.io/)

## Structure du Projet

```
src/
├── components/          # Composants UI réutilisables
│   ├── ui/             # Composants de base (shadcn)
│   └── layout/         # Composants de mise en page
├── features/           # Modules par fonctionnalité
│   ├── auth/           # Authentification
│   ├── reports/        # Gestion des imports
│   ├── payment-reports/# Rapports de paiement
│   ├── drivers/        # Gestion des chauffeurs
│   └── users/          # Gestion des utilisateurs
├── lib/               # Utilitaires et configurations
└── hooks/             # Hooks React personnalisés
```

## Installation

1. Cloner le projet
```bash
git clone [url-du-projet]
```

2. Installer les dépendances
```bash
pnpm install
```

3. Lancer le serveur de développement
```bash
pnpm run dev
```

## Captures d'écran

![alt text](public/images/screenshot.png)

## Licence

[MIT License](https://choosealicense.com/licenses/mit/)
