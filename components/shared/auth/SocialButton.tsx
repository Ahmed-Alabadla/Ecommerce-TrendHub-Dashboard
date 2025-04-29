import { Button } from "@/components/ui/button";
import Image from "next/image";
import google from "@/public/icons/google.svg";
function SocialButton() {
  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      // onClick={handleGoogleLogin}
    >
      <Image src={google} alt="google" width={22} height={22} />
      Sign with Google
    </Button>
  );
}

export default SocialButton;
