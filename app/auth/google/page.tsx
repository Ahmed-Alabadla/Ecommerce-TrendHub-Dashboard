// app/auth/google/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";

export default function GoogleAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const accessToken = searchParams.get("access_token");
        // const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get("error");

        if (error) {
          console.error("OAuth Error:", error);
          setStatus("error");
          // Redirect to login with error
          router.push(`/auth/login?error=${encodeURIComponent(error)}`);
          return;
        }

        if (!accessToken) {
          console.error("No access token received");
          setStatus("error");
          router.push("/auth/login?error=no_token");
          return;
        }

        // Store tokens in cookies
        setCookie("access_token", accessToken, {
          maxAge: 60 * 60 * 24, // 1 days
          httpOnly: false, // Set to true if you want httpOnly cookies
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        // if (refreshToken) {
        //   setCookie('refresh_token', refreshToken, {
        //     maxAge: 60 * 60 * 24 * 30, // 30 days
        //     httpOnly: false,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'lax',
        //     path: '/',
        //   });
        // }

        // Optional: Verify token and get user info

        setStatus("success");

        router.push("/");
      } catch (error) {
        console.error("Error processing auth callback:", error);
        setStatus("error");
        router.push("/auth/login?error=processing_failed");
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === "processing" && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Processing authentication...</p>
          </div>
        )}
        {status === "success" && (
          <div>
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <p className="text-gray-600">
              Authentication successful! Redirecting...
            </p>
          </div>
        )}
        {status === "error" && (
          <div>
            <div className="text-red-600 text-4xl mb-4">✗</div>
            <p className="text-gray-600">
              Authentication failed. Redirecting to login...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
