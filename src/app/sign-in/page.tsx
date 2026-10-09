
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

const SignInPage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);

  // Email and password login
  const onSubmit = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      toast.danger("ইমেইল ও পাসওয়ার্ড লিখুন");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.danger(error.message || "লগইন ব্যর্থ হয়েছে");
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");

      router.push("/");
      router.refresh();
    } catch {
      toast.danger("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const handleGoogleSignIn = async () => {
    setSocialLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.danger(error.message || "Google লগইন ব্যর্থ হয়েছে");
        setSocialLoading(false);
      }
    } catch {
      toast.danger("Google দিয়ে লগইন করা যাচ্ছে না");
      setSocialLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F0F5F0] px-4 py-12">
      {/* Page heading */}
      <div className="mb-8 w-full max-w-md space-y-3 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          সাইন ইন
        </h1>

        <p className="text-sm leading-6 text-gray-600">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে
          আপনার অ্যাকাউন্টে প্রবেশ করুন।
        </p>
      </div>

      {/* Sign-in card */}
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        {/* Email and password form */}
        <Form
          className="flex w-full flex-col gap-5"
          onSubmit={onSubmit}
        >
          {/* Email field */}
          <TextField
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
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

          {/* Password field */}
          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (!value) {
                return "পাসওয়ার্ড লিখুন";
              }

              return null;
            }}
          >
            <Label>পাসওয়ার্ড</Label>

            <Input
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              autoComplete="current-password"
            />

            <Description>
              আপনার অ্যাকাউন্টের পাসওয়ার্ড লিখুন।
            </Description>

            <FieldError />
          </TextField>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-green-700 font-semibold text-white hover:bg-green-800"
            isDisabled={loading || socialLoading}
          >
            {loading ? "লগইন হচ্ছে..." : "সাইন ইন"}
          </Button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />

          <span className="text-xs text-gray-400">অথবা</span>

          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Google login */}
        <Button
          type="button"
          onPress={handleGoogleSignIn}
          className="w-full border border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-100"
          isDisabled={loading || socialLoading}
        >
          {socialLoading
            ? "Google দিয়ে লগইন হচ্ছে..."
            : "Google দিয়ে চালিয়ে যান"}
        </Button>

        {/* Sign-up link */}
        <p className="text-center text-sm text-gray-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/signup"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন আপ করুন
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

export default SignInPage;
