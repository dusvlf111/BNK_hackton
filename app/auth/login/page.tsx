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
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useActionState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { loginAction } from "./actions";
import { loginInitialState } from "./state";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(loginAction, loginInitialState);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
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
        <CardTitle>로그인</CardTitle>
        <CardDescription>등록된 계정 정보로 로그인하세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          {state.status === "error" && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}
          <Button
            className="w-full transition-opacity duration-300"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "처리 중..." : "로그인"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 text-sm">
        <span>계정이 없으신가요?</span>
        <Link className="text-primary underline" href="/auth/signup">
          회원가입 페이지로 이동
        </Link>
      </CardFooter>
    </Card>
  );
}
