/**
 * Règles de validation pour les différents champs
 */
const VALIDATION_RULES = {
  USERNAME: {
    min: 3,
    max: 30,
    pattern: /^[a-zA-Z0-9_]+$/,
    message: 'Le nom d\'utilisateur doit contenir entre 3 et 30 caractères alphanumériques ou _',
  },
  PASSWORD: {
    min: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Veuillez entrer une adresse email valide',
  },
  PHONE: {
    pattern: /^\+?[1-9]\d{1,14}$/,
    message: 'Veuillez entrer un numéro de téléphone valide',
  },
  NAME: {
    min: 2,
    max: 50,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    message: 'Le nom doit contenir entre 2 et 50 caractères alphabétiques',
  },
};

/**
 * Valide un nom d'utilisateur
 * @param {string} username - Nom d'utilisateur à valider
 * @returns {Object} Résultat de la validation
 */
export const validateUsername = (username) => {
  const { min, max, pattern, message } = VALIDATION_RULES.USERNAME;

  if (!username || username.length < min || username.length > max) {
    return {
      isValid: false,
      message,
    };
  }

  if (!pattern.test(username)) {
    return {
      isValid: false,
      message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Valide un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {Object} Résultat de la validation
 */
export const validatePassword = (password) => {
  const { min, pattern, message } = VALIDATION_RULES.PASSWORD;

  if (!password || password.length < min) {
    return {
      isValid: false,
      message,
    };
  }

  if (!pattern.test(password)) {
    return {
      isValid: false,
      message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {Object} Résultat de la validation
 */
export const validateEmail = (email) => {
  const { pattern, message } = VALIDATION_RULES.EMAIL;

  if (!email || !pattern.test(email)) {
    return {
      isValid: false,
      message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Valide un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à valider
 * @returns {Object} Résultat de la validation
 */
export const validatePhone = (phone) => {
  const { pattern, message } = VALIDATION_RULES.PHONE;

  if (!phone || !pattern.test(phone)) {
    return {
      isValid: false,
      message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Valide un nom ou prénom
 * @param {string} name - Nom à valider
 * @returns {Object} Résultat de la validation
 */
export const validateName = (name) => {
  const { min, max, pattern, message } = VALIDATION_RULES.NAME;

  if (!name || name.length < min || name.length > max) {
    return {
      isValid: false,
      message,
    };
  }

  if (!pattern.test(name)) {
    return {
      isValid: false,
      message,
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Formate un numéro de téléphone
 * @param {string} phone - Numéro de téléphone à formater
 * @returns {string} Numéro de téléphone formaté
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';

  // Supprimer tous les caractères non numériques
  const cleaned = phone.replace(/\D/g, '');

  // Format français : +33 6 12 34 56 78
  if (cleaned.startsWith('33') || cleaned.startsWith('0')) {
    const match = cleaned.match(/^(?:33|0)?(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      const [, a, b, c, d, e] = match;
      return `+33 ${a} ${b} ${c} ${d} ${e}`;
    }
  }

  // Format international par défaut
  return `+${cleaned}`;
};

/**
 * Normalise un nom d'utilisateur
 * @param {string} username - Nom d'utilisateur à normaliser
 * @returns {string} Nom d'utilisateur normalisé
 */
export const normalizeUsername = (username) => {
  if (!username) return '';

  // Convertir en minuscules et supprimer les espaces
  return username.toLowerCase().trim().replace(/\s+/g, '_');
};

/**
 * Valide un objet utilisateur complet
 * @param {Object} user - Objet utilisateur à valider
 * @returns {Object} Résultat de la validation
 */
export const validateUser = (user) => {
  const errors = {};

  // Valider le nom d'utilisateur
  const usernameValidation = validateUsername(user.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message;
  }

  // Valider l'email
  const emailValidation = validateEmail(user.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }

  // Valider le nom si présent
  if (user.full_name) {
    const nameValidation = validateName(user.full_name);
    if (!nameValidation.isValid) {
      errors.full_name = nameValidation.message;
    }
  }

  // Valider le téléphone si présent
  if (user.phone) {
    const phoneValidation = validatePhone(user.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.message;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  validateUsername,
  validatePassword,
  validateEmail,
  validatePhone,
  validateName,
  validateUser,
  formatPhoneNumber,
  normalizeUsername,
};
