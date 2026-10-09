
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

const SignUpPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // Email and password registration
  const onSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );

    if (!name) {
      toast.danger("আপনার নাম লিখুন");
      return;
    }

    if (password.length < 8) {
      toast.danger("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      toast.danger(
        "পাসওয়ার্ডে একটি বড় হাতের ইংরেজি অক্ষর ও একটি সংখ্যা দিন"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.danger("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        toast.danger(
          error.message || "অ্যাকাউন্ট তৈরি করা যায়নি"
        );
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

      router.push("/signin");
      router.refresh();
    } catch {
      toast.danger("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Google registration
  const handleGoogleSignUp = async () => {
    setSocialLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.danger(
          error.message || "Google দিয়ে সাইন আপ ব্যর্থ হয়েছে"
        );
        setSocialLoading(false);
      }
    } catch {
      toast.danger("Google দিয়ে সাইন আপ করা যাচ্ছে না");
      setSocialLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F0F5F0] px-4 py-12">
      {/* Page heading */}
      <div className="mb-8 w-full max-w-md space-y-3 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="text-sm leading-6 text-gray-600">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Signup card */}
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Registration form */}
        <Form
          className="flex w-full flex-col gap-5"
          onSubmit={onSubmit}
        >
          {/* Name */}
          <TextField
            isRequired
            name="name"
            type="text"
            validate={(value) => {
              if (!value.trim()) {
                return "আপনার নাম লিখুন";
              }

              return null;
            }}
          >
            <Label>আপনার নাম</Label>

            <Input
              placeholder="আপনার পূর্ণ নাম লিখুন"
              autoComplete="name"
            />

            <FieldError />
          </TextField>

          {/* Email */}
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                  value
                )
              ) {
                return "সঠিক ইমেইল ঠিকানা লিখুন";
              }

              return null;
            }}
          >
            <Label>ইমেইল</Label>

            <Input
              placeholder="you@example.com"
              autoComplete="email"
            />

            <FieldError />
          </TextField>

          {/* Password */}
          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
              }

              if (!/[A-Z]/.test(value)) {
                return "কমপক্ষে একটি বড় হাতের ইংরেজি অক্ষর দিন";
              }

              if (!/[0-9]/.test(value)) {
                return "কমপক্ষে একটি সংখ্যা দিন";
              }

              return null;
            }}
          >
            <Label>পাসওয়ার্ড</Label>

            <Input
              placeholder="কমপক্ষে ৮ অক্ষর"
              autoComplete="new-password"
            />

            <Description>
              কমপক্ষে ৮ অক্ষর, একটি বড় হাতের অক্ষর ও একটি সংখ্যা দিন।
            </Description>

            <FieldError />
          </TextField>

          {/* Confirm password */}
          <TextField
            isRequired
            name="confirmPassword"
            type="password"
            validate={(value) => {
              if (!value) {
                return "পাসওয়ার্ড নিশ্চিত করুন";
              }

              if (
                value !==
                (document.querySelector(
                  'input[name="password"]'
                ) as HTMLInputElement | null)?.value
              ) {
                return "দুটি পাসওয়ার্ড মিলছে না";
              }

              return null;
            }}
          >
            <Label>পাসওয়ার্ড নিশ্চিত করুন</Label>

            <Input
              placeholder="আবার পাসওয়ার্ড লিখুন"
              autoComplete="new-password"
            />

            <FieldError />
          </TextField>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-green-700 font-semibold text-white hover:bg-green-800"
            isDisabled={loading || socialLoading}
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "সাইন আপ করুন"}
          </Button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs text-gray-400">অথবা</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google registration */}
        <Button
          type="button"
          onPress={handleGoogleSignUp}
          className="w-full border border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-100"
          isDisabled={loading || socialLoading}
        >
          {socialLoading
            ? "Google দিয়ে সাইন আপ হচ্ছে..."
            : "Google দিয়ে চালিয়ে যান"}
        </Button>

        {/* Sign-in link */}
        <p className="text-center text-sm text-gray-600">
          অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>

        {/* Back to home */}
        <div className="border-t border-gray-100 pt-4 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 transition hover:text-green-700"
          >
            ← হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SignUpPage;

