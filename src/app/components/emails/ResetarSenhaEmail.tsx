import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface ResetarSenhaEmailProps {
  url: string
  name: string
}

export default function ResetarSenhaEmail({ url, name }: ResetarSenhaEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Redefina sua senha no Tutoria</Preview>
      <Body style={{ backgroundColor: "#f9f9f9", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 0" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px" }}>
            <Heading style={{ color: "#1a1a1a", fontSize: "24px", margin: "0 0 16px", fontWeight: "700" }}>
              Redefina sua senha
            </Heading>
            <Text style={{ color: "#444", fontSize: "16px", margin: "0 0 24px" }}>
              Olá, {name}! Recebemos uma solicitação para redefinir sua senha no Tutoria.
              Clique no botão abaixo para criar uma nova senha.
            </Text>
            <Button
              href={url}
              style={{
                backgroundColor: "#6c3ee8",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
                textDecoration: "none",
                textAlign: "center",
                margin: "0 auto",
                display: "block",
                cursor: "pointer",
                width: "200px",
              }}
            >
              Redefinir senha
            </Button>
            <Text style={{ color: "#999", fontSize: "14px", margin: "24px 0 0", textAlign: "center" }}>
              Este link expira em 1 hora. Se você não solicitou esta alteração, ignore este e-mail.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
