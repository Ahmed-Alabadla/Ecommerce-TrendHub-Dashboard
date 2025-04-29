"use client";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePasswordStrength } from "@/hooks/use-password-strength";
import { ResetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Repeat2 } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("newPassword") || "";
  const { message, getColor, getPercentage } =
    usePasswordStrength(passwordValue);

  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();

  // Get query parameters
  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  async function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      toast.error("Invalid Reset Token", {
        description:
          "No reset token found. Please request a new password reset.",
        duration: 5000,
      });

      return;
    }

    startTransition(() => {
      resetPassword(values, token, userId!).then((res) => {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* New Password Input */}
      <div>
        <Input
          {...register("newPassword")}
          placeholder="Password"
          disabled={isPending}
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
        {errors.newPassword && (
          <p className="text-destructive text-sm mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div>
        <Input
          {...register("confirmPassword")}
          placeholder="Confirm Password"
          disabled={isPending}
          type="password"
        />
        {errors.confirmPassword && (
          <p className="text-destructive text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Resetting password...
          </>
        ) : (
          <>
            <Repeat2 className="mr-2 h-4 w-4" />
            Reset Password
          </>
        )}
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
