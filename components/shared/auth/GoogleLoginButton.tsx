"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import google from "@/public/icons/google.svg";

function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={handleLogin}
    >
      <Image src={google} alt="google" width={22} height={22} />
      Sign with Google
    </Button>
  );
}

export default GoogleLoginButton;
