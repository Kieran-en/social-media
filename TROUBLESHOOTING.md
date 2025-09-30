# 🔧 Guide de Dépannage - Mise à Niveau Sécuritaire

## ❌ **Erreurs Courantes et Solutions**

### **1. "Cannot find module 'helmet'"**

**Problème** : Modules de sécurité non installés

```bash
Error: Cannot find module 'helmet'
Error: Cannot find module 'express-rate-limit'
```

**Solution** :

```bash
cd backend
npm install helmet express-rate-limit
```

### **2. "JWT_SECRET is required"**

**Problème** : Fichier `.env` manquant ou mal configuré

**Solution** : Créer le fichier `backend/.env` :

```env
JWT_SECRET=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678
JWT_EXPIRES_IN=24h
DB_HOST=127.0.0.1
DB_NAME=groupamania
DB_USER=root
DB_PASSWORD=@yesyes21
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4000
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:4000
```

### **3. "Cannot find module '../config/security'"**

**Problème** : Fichier de configuration manquant

**Solution** : Le fichier `backend/config/security.js` doit exister. S'il est manquant, le recréer avec le contenu complet.

### **4. Erreurs de validation**

**Problème** :

```bash
Error: Cannot find module '../middlewares/validation'
```

**Solution** : Vérifier que `backend/middlewares/validation.js` existe.

### **5. "Too many requests"**

**Problème** : Rate limiting activé

**Solution** : Attendre 15 minutes ou ajuster la configuration dans `.env` :

```env
RATE_LIMIT_WINDOW_MS=60000  # 1 minute au lieu de 15
RATE_LIMIT_MAX_REQUESTS=200 # Plus de requêtes autorisées
```

## 🚀 **Script de Configuration Automatique**

**Windows** : Exécuter `setup-security.bat`
**Linux/Mac** :

```bash
cd backend
npm install helmet express-rate-limit
touch .env
# Copier le contenu du .env depuis le guide
```

## 🔍 **Vérification de l'Installation**

### **1. Vérifier les modules**

```bash
cd backend
npm list helmet express-rate-limit
```

### **2. Tester le serveur**

```bash
npm start
```

Le serveur doit démarrer sans erreur et afficher :

```
Listening on port 3000
Database connected successfully...
```

### **3. Tester la sécurité**

**Rate Limiting** :

```bash
# Faire 6 requêtes rapides vers /api/auth/login
# La 6ème doit être bloquée avec "Too many requests"
```

**Headers de sécurité** :

```bash
curl -I http://localhost:3000/api/auth/login
# Doit inclure des headers comme X-Frame-Options, X-Content-Type-Options
```

## 📊 **Monitoring des Logs**

### **Logs créés automatiquement** :

- `backend/logs/auth.log` - Connexions
- `backend/logs/security.log` - Actions sensibles
- `backend/logs/error.log` - Erreurs
- `backend/logs/api.log` - Requêtes API
- `backend/logs/upload.log` - Uploads de fichiers

### **Surveiller les logs** :

```bash
# Windows
type backend\logs\auth.log
# Linux/Mac
tail -f backend/logs/auth.log
```

## 🔄 **Rollback en Cas de Problème**

Si la mise à niveau cause des problèmes, vous pouvez temporairement :

### **1. Désactiver les nouveaux middlewares**

Dans `backend/app.js`, commenter :

```javascript
// app.use(helmet({...}));
// app.use('/api/', globalLimiter);
```

### **2. Revenir à l'ancien système d'auth**

Dans `backend/middlewares/auth.js`, utiliser l'ancien secret :

```javascript
const decodedToken = jwt.verify(token, "RANDOM_SECRET_KEY");
```

### **3. Désactiver la validation**

Dans les routes, supprimer temporairement :

```javascript
// validateUserCreation, validateUserUpdate, etc.
```

## 🆘 **Support**

Si les problèmes persistent :

1. **Vérifier les logs d'erreur** : `backend/logs/error.log`
2. **Mode debug** : Ajouter `console.log` dans les middlewares
3. **Tester étape par étape** : Activer les améliorations une par une

## ✅ **Checklist de Fonctionnement**

- [ ] Modules installés (`npm list helmet express-rate-limit`)
- [ ] Fichier `.env` créé avec JWT_SECRET
- [ ] Serveur démarre sans erreur
- [ ] Rate limiting fonctionne (test avec 6 requêtes rapides)
- [ ] Headers de sécurité présents (`curl -I`)
- [ ] Logs créés dans `backend/logs/`
- [ ] Validation des mots de passe active
- [ ] Upload de fichiers sécurisé

**Score OWASP attendu : 8.5/10** 🎯

