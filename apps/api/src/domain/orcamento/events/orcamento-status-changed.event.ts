export class OrcamentoStatusChangedEvent {
  constructor(
    public readonly orcamentoId: number,
    public readonly previousStatus: string,
    public readonly newStatus: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}
