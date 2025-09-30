const { validation: validationConfig } = require('../config/security');

// Validation des mots de passe
const validatePassword = (password) => {
  const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSymbols } = validationConfig.password;
  
  const errors = [];
  
  if (!password || password.length < minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  }
  
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (requireNumbers && !/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  if (requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }
  
  return errors;
};

// Validation des emails
const validateEmail = (email) => {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || !emailRegex.test(email)) {
    errors.push('Format d\'email invalide');
  }
  
  if (email && email.length > validationConfig.email.maxLength) {
    errors.push(`L'email ne peut pas dépasser ${validationConfig.email.maxLength} caractères`);
  }
  
  return errors;
};

// Validation des noms
const validateName = (name) => {
  const { minLength, maxLength } = validationConfig.name;
  const errors = [];
  
  if (!name || name.trim().length < minLength) {
    errors.push(`Le nom doit contenir au moins ${minLength} caractères`);
  }
  
  if (name && name.trim().length > maxLength) {
    errors.push(`Le nom ne peut pas dépasser ${maxLength} caractères`);
  }
  
  // Vérifier les caractères autorisés (lettres, espaces, tirets, apostrophes)
  if (name && !/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name.trim())) {
    errors.push('Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes');
  }
  
  return errors;
};

// Sanitisation des inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprimer les scripts
    .replace(/[<>]/g, '') // Supprimer < et >
    .substring(0, 1000); // Limiter la longueur
};

// Middleware de validation pour la création d'utilisateur
const validateUserCreation = (req, res, next) => {
  const { name, email, password, role } = req.body;
  const errors = [];
  
  // Valider le nom
  errors.push(...validateName(name));
  
  // Valider l'email
  errors.push(...validateEmail(email));
  
  // Valider le mot de passe
  errors.push(...validatePassword(password));
  
  // Valider le rôle
  const validRoles = ['user', 'admin', 'diacre', 'responsable_groupe'];
  if (role && !validRoles.includes(role)) {
    errors.push('Rôle invalide');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors
    });
  }
  
  // Sanitiser les inputs
  req.body.name = sanitizeInput(name);
  req.body.email = sanitizeInput(email);
  
  next();
};

// Middleware de validation pour la mise à jour d'utilisateur
const validateUserUpdate = (req, res, next) => {
  const { name, email, newPassword } = req.body;
  const errors = [];
  
  // Valider le nom si fourni
  if (name !== undefined) {
    errors.push(...validateName(name));
  }
  
  // Valider l'email si fourni
  if (email !== undefined) {
    errors.push(...validateEmail(email));
  }
  
  // Valider le nouveau mot de passe si fourni
  if (newPassword !== undefined) {
    errors.push(...validatePassword(newPassword));
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors
    });
  }
  
  // Sanitiser les inputs
  if (name !== undefined) req.body.name = sanitizeInput(name);
  if (email !== undefined) req.body.email = sanitizeInput(email);
  
  next();
};

// Middleware de validation pour les posts
const validatePost = (req, res, next) => {
  const { text } = req.body;
  const errors = [];
  
  if (!text || text.trim().length === 0) {
    errors.push('Le contenu du post ne peut pas être vide');
  }
  
  if (text && text.length > 2000) {
    errors.push('Le contenu du post ne peut pas dépasser 2000 caractères');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors
    });
  }
  
  // Sanitiser le contenu
  req.body.text = sanitizeInput(text);
  
  next();
};

// Middleware de validation pour les groupes
const validateGroup = (req, res, next) => {
  const { name, description } = req.body;
  const errors = [];
  
  // Valider le nom du groupe
  if (!name || name.trim().length < 3) {
    errors.push('Le nom du groupe doit contenir au moins 3 caractères');
  }
  
  if (name && name.trim().length > 100) {
    errors.push('Le nom du groupe ne peut pas dépasser 100 caractères');
  }
  
  // Valider la description si fournie
  if (description && description.length > 500) {
    errors.push('La description ne peut pas dépasser 500 caractères');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Données invalides',
      details: errors
    });
  }
  
  // Sanitiser les inputs
  req.body.name = sanitizeInput(name);
  if (description) req.body.description = sanitizeInput(description);
  
  next();
};

module.exports = {
  validatePassword,
  validateEmail,
  validateName,
  sanitizeInput,
  validateUserCreation,
  validateUserUpdate,
  validatePost,
  validateGroup
};

