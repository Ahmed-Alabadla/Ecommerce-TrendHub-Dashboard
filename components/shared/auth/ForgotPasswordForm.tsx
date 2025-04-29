"use client";
import { forgotPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { AtSign, Loader2, Send } from "lucide-react";
import { redirect } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    startTransition(() => {
      forgotPassword(values).then((res) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormDescription>
                We&apos;ll send a password reset link to this email address.
              </FormDescription>
              <FormControl>
                <div className="relative">
                  <AtSign className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="name@example.com"
                    className="pl-9"
                    {...field}
                    disabled={isPending}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send reset link
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default ForgotPasswordForm;
