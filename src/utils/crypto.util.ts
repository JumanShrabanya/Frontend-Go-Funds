import JSEncrypt from 'jsencrypt';

/**
 * Encrypts a plaintext password using the RSA public key defined in the environment.
 * The backend will decrypt this using the corresponding private key.
 */
export function encryptPassword(plainText: string): string {
  const publicKey = process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY;
  if (!publicKey) {
    console.warn('NEXT_PUBLIC_RSA_PUBLIC_KEY is missing! Sending password unencrypted (not recommended).');
    return plainText;
  }

  const encrypt = new JSEncrypt();
  // Handle literal escaped newlines if they appear from env vars
  encrypt.setPublicKey(publicKey.replace(/\\n/g, '\n'));
  
  const encrypted = encrypt.encrypt(plainText);
  if (!encrypted) {
    throw new Error('Failed to encrypt password');
  }
  
  return encrypted;
}
