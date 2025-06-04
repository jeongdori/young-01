export const importRSAPublicKey = async (pem: string): Promise<CryptoKey> => {
    const b64 = pem
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .replace(/\s/g, '');

    const binaryDer = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey(
        'spki',
        binaryDer.buffer,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        false,
        ['encrypt'],
    );
};

export const encryptWithRSA = async (publicKey: CryptoKey, plainText: string): Promise<string> => {
    const encoded = new TextEncoder().encode(plainText);
    const encrypted = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, encoded);
    return btoa(String.fromCharCode(...new Uint8Array(encrypted))); // Base64 인코딩
};
