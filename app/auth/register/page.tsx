import AuthCard from "@/components/shared/auth/AuthCard";
import RegisterForm from "@/components/shared/auth/RegisterForm";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account for TrendHub to start shopping.",
};

function RegisterPage() {
  return (
    <AuthCard
      title="Create an account"
      subtitle="Enter your information to get started"
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}

export default RegisterPage;
