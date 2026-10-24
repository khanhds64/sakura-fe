import { USER_ROLE } from "@/src/lib/constants";
import LayoutView from "@/src/views/LayoutView";
import { LoginPageView } from "@/src/views/LoginPageView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <LayoutView>
      <LoginPageView />
    </LayoutView>
  );
}
