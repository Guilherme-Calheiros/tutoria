import {
    pgTable,
    pgEnum,
    integer,
    text,
    boolean,
    numeric,
    smallint,
    index,
    primaryKey,
    check,
} from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { user } from "./auth-schema"

// ----------------------------
// ENUMS
// ----------------------------

export const modalidadeEnum = pgEnum("modalidade", [
    "ead",
    "presencial",
    "ambos",
])

// ----------------------------
// TABLES
// ----------------------------

export const tutor = pgTable("tutor", {
    userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
    descricao: text("descricao"),
    modalidade: modalidadeEnum("modalidade").notNull(),
    ensinaTurma: boolean("ensina_turma").notNull().default(false),
    ensinaPrivado: boolean("ensina_privado").notNull().default(true),
    valorHora: numeric("valor_hora", { precision: 10, scale: 2 }),
})

export const enderecoAtendimento = pgTable(
    "endereco_atendimento", {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    tutorId: text("tutor_id").notNull().references(() => tutor.userId, { onDelete: "cascade" }),
    bairro: text("bairro").notNull(),
    cidade: text("cidade").notNull(),
    estado: text("estado").notNull(),
},
    (t) => [index("endereco_tutor_idx").on(t.tutorId)]
)

export const materia = pgTable("materia", {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    nome: text("nome").notNull().unique(),
})

export const materiaTutor = pgTable(
    "materia_tutor",
    {
        tutorId: text("tutor_id").notNull().references(() => tutor.userId, { onDelete: "cascade" }),
        materiaId: integer("materia_id").notNull().references(() => materia.id, { onDelete: "cascade" }),
    },
    (t) => [primaryKey({ columns: [t.tutorId, t.materiaId] })]
)

export const nivelEnsino = pgTable("nivel_ensino", {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    nome: text("nome").notNull().unique(),
})

export const nivelEnsinoTutor = pgTable(
    "nivel_ensino_tutor",
    {
        tutorId: text("tutor_id").notNull().references(() => tutor.userId, { onDelete: "cascade" }),
        nivelEnsinoId: integer("nivel_ensino_id").notNull().references(() => nivelEnsino.id, { onDelete: "cascade" }),
    },
    (t) => [primaryKey({ columns: [t.tutorId, t.nivelEnsinoId] })]
)

export const disponibilidade = pgTable(
    "disponibilidade",
    {
        id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
        tutorId: text("tutor_id").notNull().references(() => tutor.userId, { onDelete: "cascade" }),
        diaDaSemana: smallint("dia_da_semana").notNull(), // 0 = domingo, 6 = sábado
        startTime: text("start_time").notNull(), // formato "HH:mm"
        endTime: text("end_time").notNull(),   // formato "HH:mm"
        isAtivo: boolean("is_ativo").notNull().default(true),
    },
    (t) => [
        index("disponibilidade_index_0").on(t.tutorId),
        check("dia_da_semana_check", sql`${t.diaDaSemana} >= 0 AND ${t.diaDaSemana} <= 6`)
    ]

)

// ----------------------------
// RELATIONS
// ----------------------------

export const usersRelations = relations(user, ({ one }) => ({
    tutor: one(tutor, {
        fields: [user.id],
        references: [tutor.userId],
    }),
}))

export const tutorRelations = relations(tutor, ({ one, many }) => ({
    user: one(user, { fields: [tutor.userId], references: [user.id] }),
    enderecos: many(enderecoAtendimento),
    materias: many(materiaTutor),
    niveisEnsino: many(nivelEnsinoTutor),
    disponibilidades: many(disponibilidade),
}))

export const enderecoAtendimentoRelations = relations(enderecoAtendimento, ({ one }) => ({
    tutor: one(tutor, { fields: [enderecoAtendimento.tutorId], references: [tutor.userId] }),
}))

export const materiaRelations = relations(materia, ({ many }) => ({
    tutores: many(materiaTutor),
}))

export const materiaTutorRelations = relations(materiaTutor, ({ one }) => ({
    tutor: one(tutor, { fields: [materiaTutor.tutorId], references: [tutor.userId] }),
    materia: one(materia, { fields: [materiaTutor.materiaId], references: [materia.id] }),
}))

export const nivelEnsinoRelations = relations(nivelEnsino, ({ many }) => ({
    tutores: many(nivelEnsinoTutor),
}))

export const nivelEnsinoTutorRelations = relations(nivelEnsinoTutor, ({ one }) => ({
    tutor: one(tutor, { fields: [nivelEnsinoTutor.tutorId], references: [tutor.userId] }),
    nivelEnsino: one(nivelEnsino, { fields: [nivelEnsinoTutor.nivelEnsinoId], references: [nivelEnsino.id] }),
}))

export const disponibilidadeRelations = relations(disponibilidade, ({ one }) => ({
    tutor: one(tutor, { fields: [disponibilidade.tutorId], references: [tutor.userId] }),
}))