import AuthCard from "@/components/shared/auth/AuthCard";
import ResetPasswordForm from "@/components/shared/auth/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Enter your email address to receive a link to reset your password and regain access to your TrendHub account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Reset Password"
      subtitle="Enter your email address to receive a link to reset your password and regain access to your TrendHub account."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
