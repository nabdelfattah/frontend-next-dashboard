import SignInForm from "@/domains/auth/presentation/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignIn Page | I-fikra",
  description: "This is Signin Page",
};

export default function SignIn() {
  return <SignInForm />;
}
