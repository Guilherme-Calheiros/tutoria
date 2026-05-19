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

interface DeletarContaEmailProps {
  url: string
  name: string
}

export default function DeletarContaEmail({ url, name }: DeletarContaEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirme a exclusão da sua conta no Tutoria</Preview>
      <Body style={{ backgroundColor: "#f9f9f9", fontFamily: "sans-serif" }}>
        <Container style={{ maxWidth: "480px", margin: "0 auto", padding: "32px 0" }}>
          <Section style={{ backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px" }}>
            <Heading style={{ color: "#1a1a1a", fontSize: "24px", margin: "0 0 16px", fontWeight: "700" }}>
              Solicitação de exclusão de conta
            </Heading>
            <Text style={{ color: "#444", fontSize: "16px", margin: "0 0 24px" }}>
              Olá, {name}! Recebemos uma solicitação para excluir sua conta no Tutoria.
              Clique no botão abaixo para confirmar. Esta ação é irreversível e todos
              os seus dados serão removidos permanentemente.
            </Text>
            <Button
              href={url}
              style={{
                backgroundColor: "#dc2626",
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
                width: "280px",
              }}
            >
              Confirmar exclusão da conta
            </Button>
            <Text style={{ color: "#999", fontSize: "14px", margin: "24px 0 0", textAlign: "center" }}>
              Se você não solicitou esta exclusão, ignore este e-mail.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
