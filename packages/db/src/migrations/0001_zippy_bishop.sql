CREATE INDEX "orcamentos_cliente_id_idx" ON "orcamentos" USING btree ("cliente_id");--> statement-breakpoint
CREATE INDEX "orcamentos_status_idx" ON "orcamentos" USING btree ("status");