import PublicLayoutWrapper from "@/components/layout/PublicLayoutWrapper";
import { AuthProvider } from "@/context/AuthContext";

export default function PublicLayout({ children }) {
  return (
    <AuthProvider>
      <PublicLayoutWrapper>{children}</PublicLayoutWrapper>
    </AuthProvider>
  );
}