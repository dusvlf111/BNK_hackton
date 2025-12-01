"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signupSchema, type SignupFormValues } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { signupAction } from "./actions";
import { signupInitialState } from "./state";

type FieldConfig = {
  label: string;
  type: "text" | "email" | "password" | "tel";
  autoComplete: string;
};

const fieldConfigs: Record<keyof SignupFormValues, FieldConfig> = {
  email: { label: "이메일", type: "email", autoComplete: "email" },
  password: {
    label: "비밀번호",
    type: "password",
    autoComplete: "new-password",
  },
  name: { label: "이름", type: "text", autoComplete: "name" },
  phone: { label: "전화번호", type: "tel", autoComplete: "tel" },
};

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, signupInitialState);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>
          기본 정보를 입력하고 케어페이 가디언을 시작하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          {Object.entries(fieldConfigs).map(([key, config]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium" htmlFor={key}>
                {config.label}
              </label>
              <Input
                id={key}
                type={config.type}
                autoComplete={config.autoComplete}
                {...register(key as keyof SignupFormValues)}
              />
              {errors[key as keyof SignupFormValues] && (
                <p className="text-sm text-red-600">
                  {errors[key as keyof SignupFormValues]?.message}
                </p>
              )}
            </div>
          ))}
          {state.status === "error" && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : "회원가입"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm">
        <span>이미 계정이 있으신가요?</span>
        <Link className="text-primary underline" href="/auth/login">
          로그인 페이지로 이동
        </Link>
      </CardFooter>
    </Card>
  );
}
