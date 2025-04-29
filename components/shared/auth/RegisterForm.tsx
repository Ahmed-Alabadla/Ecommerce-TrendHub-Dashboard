"use client";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SocialButton from "./SocialButton";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { useTransition } from "react";
import { registerAction } from "@/actions/auth";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

type RegisterFormValues = z.infer<typeof RegisterSchema>;

function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password") || "";
  const { message, getColor, getPercentage } =
    usePasswordStrength(passwordValue);

  const [isPending, startTransition] = useTransition();

  async function onSubmit(values: RegisterFormValues) {
    startTransition(() => {
      registerAction(values).then((res) => {
        if (res?.error) {
          toast.error(res.error, {
            duration: 5000,
          });
          return;
        }

        if (res?.success) {
          toast.success(res.success, {
            duration: 5000,
          });
          redirect("/auth/login");
        }
      });
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name Input */}
        <div>
          <Input
            {...register("name")}
            disabled={isPending}
            placeholder="Full Name"
            type="text"
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <Input
            {...register("email")}
            disabled={isPending}
            placeholder="Email"
            type="email"
          />
          {errors.email && (
            <p className="text-destructive text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <Input
            {...register("password")}
            disabled={isPending}
            placeholder="Password"
            type="password"
          />
          {passwordValue && (
            <div className="mt-1">
              <div className="h-1 w-full bg-gray-200">
                <div
                  className={`h-full transition-all duration-300 ${getColor()}`}
                  style={{ width: getPercentage() }}
                />
              </div>
              {message && (
                <p className="text-xs mt-1 text-muted-foreground">{message}</p>
              )}
            </div>
          )}
          {errors.password && (
            <p className="text-destructive text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div>
          <Input
            {...register("confirmPassword")}
            disabled={isPending}
            placeholder="Confirm Password"
            type="password"
          />
          {errors.confirmPassword && (
            <p className="text-destructive text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing up...
            </>
          ) : (
            <>
              <UserPlus className="mr-2 h-4 w-4" />
              Sign up
            </>
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <SocialButton />
    </>
  );
}

export default RegisterForm;
