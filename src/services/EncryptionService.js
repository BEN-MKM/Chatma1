import * as crypto from 'expo-crypto';

class EncryptionService {
  // Génération de clé privée/publique
  static async generateKeyPair() {
    const keyPair = await crypto.generateKeyPairAsync(
      crypto.CryptoAlgorithm.RSA,
      2048
    );
    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  }

  // Chiffrement asymétrique
  static async encryptMessage(message, publicKey) {
    return await crypto.encryptAsync(
      message, 
      publicKey, 
      crypto.CryptoAlgorithm.RSA
    );
  }

  // Déchiffrement asymétrique
  static async decryptMessage(encryptedMessage, privateKey) {
    return await crypto.decryptAsync(
      encryptedMessage, 
      privateKey, 
      crypto.CryptoAlgorithm.RSA
    );
  }

  // Chiffrement symétrique pour les messages rapides
  static async symmetricEncrypt(message, key) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  // Déchiffrement symétrique
  static async symmetricDecrypt(encryptedData, key) {
    const [iv, encrypted] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}

export default EncryptionService;
