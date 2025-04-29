import AuthCard from "@/components/shared/auth/AuthCard";
import LoginForm from "@/components/shared/auth/LoginForm";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your TrendHub account to continue shopping.",
};

const LoginPage = () => {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Enter your credentials to access your account"
      footer={
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="register"
            className="text-primary font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
};

export default LoginPage;
