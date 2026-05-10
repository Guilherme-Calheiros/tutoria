import { db } from "@/db"
import { materia, nivelEnsino } from "@/lib/db/schema"

async function seed() {
  await db.insert(materia).values([
    { nome: "Matemática" },
    { nome: "Português" },
    { nome: "Física" },
    { nome: "Química" },
    { nome: "Biologia" },
    { nome: "História" },
    { nome: "Geografia" },
    { nome: "Inglês" },
    { nome: "Espanhol" },
    { nome: "Filosofia" },
    { nome: "Sociologia" },
    { nome: "Literatura" },
    { nome: "Redação" },
    { nome: "Programação" },
  ]).onConflictDoNothing()

  await db.insert(nivelEnsino).values([
    { nome: "Ensino Fundamental I" },
    { nome: "Ensino Fundamental II" },
    { nome: "Ensino Médio" },
    { nome: "Ensino Superior" },
    { nome: "Concursos Públicos" },
    { nome: "Pós-graduação" },
  ]).onConflictDoNothing()

  console.log("Seed concluído!")
  process.exit(0)
}

seed()