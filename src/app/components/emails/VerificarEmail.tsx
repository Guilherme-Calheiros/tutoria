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

interface VerificarEmailProps {
  url: string
  name: string
}

export default function VerificarEmail({ url, name }: VerificarEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirme seu e-mail no Tutoria</Preview>
      <Body style={{ backgroundColor: "#f9f9f9", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 0" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px" }}>
            <Heading style={{ color: "#1a1a1a", fontSize: "24px", margin: "0 0 16px", fontWeight: "700" }}>
              Bem-vindo ao Tutoria!
            </Heading>
            <Text style={{ color: "#444", fontSize: "16px", margin: "0 0 24px" }}>
              Olá, {name}! Clique no botão abaixo para confirmar seu e-mail e acessar a plataforma.
            </Text>
            <Button
              href={url}
              style={{
                backgroundColor: "#7F77DD",
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
              Confirmar e-mail
            </Button>
            <Text style={{ color: "#999", fontSize: "14px", margin: "24px 0 0", textAlign: "center" }}>
              Se você não criou uma conta, ignore este e-mail.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}