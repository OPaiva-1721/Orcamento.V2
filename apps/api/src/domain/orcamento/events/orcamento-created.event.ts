export class OrcamentoCreatedEvent {
  constructor(
    public readonly orcamentoId: number,
    public readonly destinatarioIds: number[],
    public readonly occurredAt: Date = new Date(),
  ) {}
}
