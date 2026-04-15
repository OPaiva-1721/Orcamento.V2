/**
 * Valida se um email tem formato válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se um CNPJ é válido (formato e dígitos verificadores)
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const clean = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos
  if (clean.length !== 14) return false;

  // Rejeita sequências com todos os dígitos iguais
  if (/^(\d)\1+$/.test(clean)) return false;

  // Valida 1º dígito verificador (pesos 5→2 depois 9→2)
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(clean[i]!) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(clean[12]!) !== digit1) return false;

  // Valida 2º dígito verificador (pesos 6→2 depois 9→2)
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(clean[i]!) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return parseInt(clean[13]!) === digit2;
}

/**
 * Formata CNPJ para exibição: XX.XXX.XXX/XXXX-XX
 */
export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/[^\d]/g, '');
  return clean.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  );
}
