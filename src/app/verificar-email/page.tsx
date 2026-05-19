import { Suspense } from "react";
import VerificarEmailContent from "./VerificarEmailContent";

export default function VerificarEmailPage() {
  <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
    <Suspense fallback={
      <div className="w-full max-w-md border border-border rounded-2xl p-8 bg-background shadow text-center">
          <p className="text-muted-foreground text-sm">Carregando...</p>
      </div>
    }>
      <VerificarEmailContent />
    </Suspense>
  </main>
}