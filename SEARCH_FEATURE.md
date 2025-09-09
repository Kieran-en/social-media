# 🔍 Fonctionnalité de Recherche d'Utilisateurs

## Vue d'ensemble

La fonctionnalité de recherche d'utilisateurs permet aux utilisateurs de rechercher et de trouver d'autres utilisateurs de la plateforme en temps réel.

## Fonctionnalités

### ✨ Caractéristiques principales

- **Recherche en temps réel** : Recherche automatique après 300ms de frappe
- **Recherche par nom et email** : Recherche dans les noms et adresses email
- **Pagination** : Support de la pagination pour les résultats
- **Interface responsive** : Fonctionne sur desktop et mobile
- **Suggestions visuelles** : Affichage des profils avec photos et rôles
- **Navigation directe** : Clic pour aller au profil de l'utilisateur

### 🎯 Critères de recherche

- Minimum 2 caractères requis
- Recherche insensible à la casse
- Recherche par correspondance partielle (LIKE)
- Filtrage des utilisateurs actifs uniquement

## Architecture

### Backend

#### API Endpoint

```
GET /api/auth/search/users
```

#### Paramètres

- `query` (string, requis) : Terme de recherche (min 2 caractères)
- `page` (number, optionnel) : Numéro de page (défaut: 1)
- `limit` (number, optionnel) : Nombre de résultats par page (défaut: 10)

#### Réponse

```json
{
  "users": [
    {
      "id": 1,
      "name": "Jean Dupont",
      "email": "jean.dupont@example.com",
      "profileImg": "http://localhost:3000/images/profile.jpg",
      "role": "user",
      "followers": 10,
      "following": 5
    }
  ],
  "totalUsers": 1,
  "currentPage": 1,
  "totalPages": 1,
  "hasMore": false
}
```

### Frontend

#### Composants

1. **SearchBar** (`/Components/SearchBar.jsx`)

   - Composant principal de recherche
   - Gestion du debouncing
   - Affichage des résultats en overlay

2. **SearchResults** (`/Components/SearchResults.jsx`)
   - Affichage des résultats de recherche
   - Gestion des états (loading, error, empty)
   - Interface utilisateur pour chaque résultat

#### Services

- **userService.searchUsers()** : Appel API vers le backend

## Utilisation

### Dans la NavBar

La barre de recherche est intégrée dans la NavBar principale :

```jsx
<SearchBar
  placeholder="Rechercher des utilisateurs..."
  onUserClick={(user) => navigate(`/profilepage/${user.name}`)}
  currentUserId={userId}
/>
```

### Props du composant SearchBar

- `placeholder` (string) : Texte du placeholder
- `onUserClick` (function) : Callback appelé lors du clic sur un utilisateur
- `currentUserId` (number) : ID de l'utilisateur actuel (pour le style)
- `className` (string) : Classes CSS additionnelles

## Styles

### Fichiers CSS

- `searchBar.module.css` : Styles pour la barre de recherche
- `searchResults.module.css` : Styles pour les résultats

### Responsive Design

- Desktop : Barre de recherche dans la NavBar
- Mobile : Barre de recherche dans le menu offcanvas

## Sécurité

- **Authentification requise** : L'API nécessite un token JWT valide
- **Filtrage des utilisateurs actifs** : Seuls les utilisateurs actifs sont retournés
- **Limitation des données** : Seules les informations publiques sont exposées

## Performance

- **Debouncing** : 300ms de délai pour éviter les appels API excessifs
- **Pagination** : Limitation du nombre de résultats par page
- **Cache** : Les résultats sont mis en cache pendant la session

## Tests

Pour tester l'API de recherche :

```bash
# Démarrer le serveur backend
cd backend && npm start

# Tester l'API (dans un autre terminal)
node test-search-api.js
```

## Améliorations futures

- [ ] Recherche par rôle
- [ ] Filtres avancés
- [ ] Historique de recherche
- [ ] Suggestions de recherche
- [ ] Recherche dans les groupes
- [ ] Recherche dans les posts
