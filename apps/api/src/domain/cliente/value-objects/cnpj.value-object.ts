import { isValidCNPJ, formatCNPJ } from '@orcamento/validators';
import { InvalidCnpjException } from '../exceptions/invalid-cnpj.exception';

export class CnpjVO {
  /** CNPJ armazenado limpo (14 dígitos) */
  readonly value: string;

  private constructor(clean: string) {
    this.value = clean;
  }

  static create(raw: string): CnpjVO {
    const clean = raw.replace(/[^\d]/g, '');
    if (!isValidCNPJ(clean)) {
      throw new InvalidCnpjException(raw);
    }
    return new CnpjVO(clean);
  }

  /** Retorna CNPJ formatado: XX.XXX.XXX/XXXX-XX */
  formatted(): string {
    return formatCNPJ(this.value);
  }

  equals(other: CnpjVO): boolean {
    return this.value === other.value;
  }
}
