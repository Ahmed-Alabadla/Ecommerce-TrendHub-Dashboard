import AuthCard from "@/components/shared/auth/AuthCard";
import ForgotPasswordForm from "@/components/shared/auth/ForgotPasswordForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Forgot Password",
  description:
    "Enter your email address to receive a link to reset your password and regain access to your TrendHub account.",
};

function ForgotPassword() {
  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Button variant="link" asChild>
          <Link href="login" className="flex items-center text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </Button>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}

export default ForgotPassword;
