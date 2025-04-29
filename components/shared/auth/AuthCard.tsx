import logo from "@/public/logo.png";
import Image from "next/image";
interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

function AuthCard({ children, title, subtitle, footer }: AuthCardProps) {
  return (
    <div className="bg-card border rounded-xl shadow-sm p-6 md:p-8">
      <div className="flex justify-center mb-8">
        <Image src={logo} alt="logo" width={300} />
      </div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
      </div>
      {children}
      {footer && <div className="mt-6 text-center">{footer}</div>}
    </div>
  );
}

export default AuthCard;
