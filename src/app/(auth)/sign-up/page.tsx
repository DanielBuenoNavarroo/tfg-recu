"use client";

import AuthForm from "@/components/auth/AuthForm";
import { signUp } from "@/lib/actions/auth";
import { signUpSchema } from "@/validations";

const page = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{ email: "", password: "", fullName: "" }}
      onSubmit={signUp}
    />
  );
};

export default page;
