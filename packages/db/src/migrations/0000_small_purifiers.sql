CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" varchar(128) NOT NULL,
	"nome" varchar(255) NOT NULL,
	"cnpj" varchar(14) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefone" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destinatarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"cliente_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "emails_enviados" (
	"id" serial PRIMARY KEY NOT NULL,
	"orcamento_id" integer NOT NULL,
	"destinatario_id" integer NOT NULL,
	"data_envio" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'Enviado' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orcamentos_destinatarios" (
	"orcamento_id" integer NOT NULL,
	"destinatario_id" integer NOT NULL,
	CONSTRAINT "orcamentos_destinatarios_orcamento_id_destinatario_id_pk" PRIMARY KEY("orcamento_id","destinatario_id")
);
--> statement-breakpoint
CREATE TABLE "orcamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"descricao" varchar(1000) NOT NULL,
	"preco" numeric(12, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'Pendente' NOT NULL,
	"forma_pagamento" boolean DEFAULT false NOT NULL,
	"data_inicio" timestamp NOT NULL,
	"data_termino" timestamp,
	"cliente_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "status_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"orcamento_id" integer NOT NULL,
	"status" varchar(50) NOT NULL,
	"data_mudanca" timestamp DEFAULT now() NOT NULL,
	"observacao" varchar(500)
);
--> statement-breakpoint
ALTER TABLE "destinatarios" ADD CONSTRAINT "destinatarios_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails_enviados" ADD CONSTRAINT "emails_enviados_orcamento_id_orcamentos_id_fk" FOREIGN KEY ("orcamento_id") REFERENCES "public"."orcamentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails_enviados" ADD CONSTRAINT "emails_enviados_destinatario_id_destinatarios_id_fk" FOREIGN KEY ("destinatario_id") REFERENCES "public"."destinatarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamentos_destinatarios" ADD CONSTRAINT "orcamentos_destinatarios_orcamento_id_orcamentos_id_fk" FOREIGN KEY ("orcamento_id") REFERENCES "public"."orcamentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamentos_destinatarios" ADD CONSTRAINT "orcamentos_destinatarios_destinatario_id_destinatarios_id_fk" FOREIGN KEY ("destinatario_id") REFERENCES "public"."destinatarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_orcamento_id_orcamentos_id_fk" FOREIGN KEY ("orcamento_id") REFERENCES "public"."orcamentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clientes_owner_id_idx" ON "clientes" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "clientes_owner_email_key" ON "clientes" USING btree ("owner_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "destinatarios_email_cliente_id_key" ON "destinatarios" USING btree ("email","cliente_id");--> statement-breakpoint
CREATE UNIQUE INDEX "emails_enviados_orcamento_destinatario_key" ON "emails_enviados" USING btree ("orcamento_id","destinatario_id");--> statement-breakpoint
CREATE INDEX "status_history_orcamento_id_idx" ON "status_history" USING btree ("orcamento_id");