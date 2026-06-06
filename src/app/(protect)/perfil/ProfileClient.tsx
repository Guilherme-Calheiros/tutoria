"use client"

import { useState } from "react";
import { enderecoAtendimento, TutorSelect } from "@/lib/db/schema";
import Section from "@/app/components/Section";
import Tabs from "@/app/components/Tabs";
import DeleteAccountSection from "@/app/components/DeleteAccountSection";
import AlterarSenhaSection from "@/app/components/AlterarSenhaSection";
import PoliticasPrivacidadeSection from "@/app/components/PoliticasPrivacidadeSection";
import Mensagem from "@/app/components/Mensagem";
import AlertaPerfilIncompleto from "./AlertaPerfilIncompleto";
import SobreMimSection from "./sections/SobreMimSection";
import TutoriaSection from "./sections/TutoriaSection";
import MateriasSection from "./sections/MateriasSection";
import NiveisSection from "./sections/NiveisSection";
import AgendaSection from "./sections/AgendaSection";

type Materia = { id: number; nome: string }
type NivelEnsino = { id: number; nome: string }

type EnderecoSelect = typeof enderecoAtendimento.$inferSelect

type tutorData = (Omit<TutorSelect, "userId" | "onboardingCompleto"> & {
    materias: number[];
    niveisEnsino: number[];
    enderecos: EnderecoSelect[];
    disponibilidades: { diaDaSemana: number; startTime: string; endTime: string }[]
}) | null;

type ProfileClientProps = {
    userId: string;
    nome: string;
    telefone: string | null;
    image: string | null;
    role: string;
    tutorData: tutorData;
    todasMaterias: Materia[];
    todosNiveisEnsino: NivelEnsino[];
}

export default function ProfileClient({
    userId,
    nome,
    image,
    telefone,
    role,
    tutorData,
    todasMaterias,
    todosNiveisEnsino,
}: ProfileClientProps){
    const [mensagem, setMensagem] = useState<{ type: "sucesso" | "erro"; text: string } | null>(null);
    const faltandoCampos: { label: string; campo: string }[] = [
        ...(!telefone ? [{ label: "Celular", campo: "telefone" }] : []),
        ...(role === "tutor" && !tutorData?.descricao ? [{ label: "Descrição", campo: "descricao" }] : []),
        ...(role === "tutor" && (!tutorData?.materias || tutorData.materias.length === 0) ? [{ label: "Matérias", campo: "materias" }] : []),
        ...(role === "tutor" && (!tutorData?.niveisEnsino || tutorData.niveisEnsino.length === 0) ? [{ label: "Níveis de ensino", campo: "niveisEnsino" }] : []),
        ...(role === "tutor" && tutorData?.modalidade !== "ead" && (!tutorData?.enderecos || tutorData.enderecos.length === 0) ? [{ label: "Endereços", campo: "enderecos" }] : []),
    ]

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-4">

            <h1 className="text-4xl font-bold text-primary mb-8">
                Meu Perfil
            </h1>

            {role === "tutor" && <AlertaPerfilIncompleto faltando={faltandoCampos} />}

            <Tabs.Root defaultValue="perfil">
                <Tabs.List>
                    <Tabs.Trigger value="perfil">Informações do perfil</Tabs.Trigger>
                    <Tabs.Trigger value="conta">Sobre a conta</Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="perfil">
                    <div className="flex flex-col gap-6">
                        <SobreMimSection
                            userId={userId}
                            nome={nome}
                            telefone={telefone}
                            image={image}
                            role={role}
                            descricao={tutorData?.descricao ?? null}
                        />

                        {role === "tutor" && tutorData && (
                            <>
                                <TutoriaSection
                                    userId={userId}
                                    modalidade={tutorData.modalidade}
                                    enderecos={tutorData.enderecos}
                                    ensinaPrivado={tutorData.ensinaPrivado}
                                    ensinaTurma={tutorData.ensinaTurma}
                                    valorHora={tutorData.valorHora}
                                    voluntario={tutorData.voluntario}
                                />

                                <MateriasSection
                                    userId={userId}
                                    materiasIds={tutorData.materias}
                                    todasMaterias={todasMaterias}
                                />

                                <NiveisSection
                                    userId={userId}
                                    niveisIds={tutorData.niveisEnsino}
                                    todosNiveis={todosNiveisEnsino}
                                />

                                <AgendaSection
                                    disponibilidades={tutorData.disponibilidades}
                                />
                            </>
                        )}
                    </div>
                </Tabs.Content>

                <Tabs.Content value="conta">
                    <div className="flex flex-col gap-6">
                        <Section titulo="Alterar senha">
                            <AlterarSenhaSection />
                        </Section>

                        <DeleteAccountSection
                            onError={(msg) => setMensagem({ type: "erro", text: msg })}
                            onEmailSent={() => setMensagem({ type: "sucesso", text: "Enviamos um link de confirmação para seu e-mail. Clique no link para concluir a exclusão da sua conta." })}
                        />

                        <Section titulo="Privacidade">
                            <PoliticasPrivacidadeSection />
                        </Section>
                    </div>
                </Tabs.Content>
            </Tabs.Root>

            {mensagem && <Mensagem type={mensagem.type} message={mensagem.text} onClose={() => setMensagem(null)} duration={8000} />}
        </div>
    )
}
