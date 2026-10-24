"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { EMAIL_REGEX } from "../lib/constants";
import * as Yup from "yup";
import PasswordInput from "../components/core/PasswordInput";
import Input from "../components/core/Input";
import { ErrorText } from "../components/core/ErrorText";
import Button from "../components/core/Button";

import { useToast } from "../hooks/useToast";
import { getApiErrorMessage } from "../lib/getApiErrorMessage";
import { Heading } from "../components/core/Heading";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import { LoginRequest } from "../api";
import { apiClient } from "../api/config-api";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .test("validate-email", "Invalid email", (value) => {
      if (!value) return true;
      return EMAIL_REGEX.test(value);
    })
    .required("Email is required"),
  password: Yup.string()
    // .matches(PASSWORD_REGEX, "Invalid password")
    .required("Password is required"),
});

export const LoginPageView = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const router = useRouter();
  const { showError } = useToast();
  const { setAuthorizationData } = useAuth();

  const mutation = useMutation({
    mutationFn: (args: LoginRequest) => {
      return apiClient.login(args);
    },
    onSuccess: (res) => {
      const authInfo = {
        email: res.data.email,
        role: res.data.role,
      };

      setAuthorizationData(authInfo);
      router.replace("/");
    },
    onError: (error) => showError(getApiErrorMessage(error)),
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-124 max-w-full flex flex-col self-center gap-5">
        <Heading className="text-zinc-900 mb-5" variant="h0">
          LOGIN
        </Heading>

        <div className="flex flex-col gap-1">
          <Input
            error={errors.email?.message}
            placeholder="Enter your email"
            {...register("email")}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </div>

        <div className="flex flex-col gap-1">
          <PasswordInput
            type={"password"}
            error={errors.password?.message}
            placeholder="Enter your password"
            {...register("password")}
          />
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        </div>

        <Button onClick={onSubmit} disabled={mutation.isPending}>
          <Heading variant="h2">LOGIN</Heading>
        </Button>
      </div>
    </div>
  );
};
