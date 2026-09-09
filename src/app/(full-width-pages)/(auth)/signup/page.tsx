import SignUpForm from "@/domains/auth/presentation/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp Page | I-fikra",
  description: "This is SignUp Page",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
