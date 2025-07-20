import { ReactNode } from "react";

interface AssetsLayoutProps {
  children: ReactNode;
}

export default function AssetsLayout({ children }: AssetsLayoutProps) {
  return <>{children}</>;
} 