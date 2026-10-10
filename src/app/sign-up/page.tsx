
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Email and password signup
  const handleSignUp = async (
    event: React.SubmitEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    if (!name || !email || !password || !confirmPassword) {
      toast.danger("সবগুলো তথ্য পূরণ করুন");
      return;
    }

    if (password.length < 8) {
      toast.danger("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
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
        toast.danger(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }

      toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!");

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Signup error:", error);
      toast.danger("অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignUp = async () => {
    setSocialLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.danger(error.message || "Google দিয়ে সাইন আপ করা যায়নি");
        setSocialLoading(false);
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast.danger("Google দিয়ে সাইন আপ করা যাচ্ছে না");
      setSocialLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#F0F5F0] px-4 py-12">
      {/* Heading */}
      <div className="mb-8 w-full max-w-md space-y-3 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          নতুন অ্যাকাউন্ট তৈরি করুন
        </h1>

        <p className="text-sm leading-6 text-gray-600">
          বাজারের পণ্যের দাম দেখুন, বিভিন্ন বাজারের দাম তুলনা করুন
          এবং আপনার প্রোফাইল পরিচালনা করুন।
        </p>
      </div>

      {/* Signup card */}
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <Form
          className="flex w-full flex-col gap-5"
          onSubmit={handleSignUp}
        >
          {/* Name */}
          <TextField
            isRequired
            name="name"
            validate={(value) => {
              if (!value.trim()) {
                return "আপনার নাম লিখুন";
              }

              if (value.trim().length < 2) {
                return "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
              }

              return null;
            }}
          >
            <Label>আপনার নাম</Label>

            <Input
              placeholder="আপনার পুরো নাম"
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

          {/* Password */}
          <TextField
            isRequired
            name="password"
            type="password"
            validate={(value) => {
              if (value.length < 8) {
                return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
              }

              return null;
            }}
          >
            <Label>পাসওয়ার্ড</Label>

            <Input
              placeholder="কমপক্ষে ৮ অক্ষর"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <Description>
              কমপক্ষে ৮ অক্ষরের একটি শক্তিশালী পাসওয়ার্ড দিন।
            </Description>

            <FieldError />
          </TextField>

          

          {/* Submit */}
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

        {/* Google signup */}
        <Button
          type="button"
          onPress={handleGoogleSignUp}
          className="w-full border border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-100"
          isDisabled={loading || socialLoading}
        >
          {socialLoading
            ? "Google দিয়ে চালিয়ে যাচ্ছেন..."
            : "Google দিয়ে সাইন আপ করুন"}
        </Button>

        {/* Sign-in link */}
        <p className="text-center text-sm text-gray-600">
          আগে থেকেই অ্যাকাউন্ট আছে?{" "}
          <Link
            href="/signin"
            className="font-semibold text-green-700 hover:underline"
          >
            সাইন ইন করুন
          </Link>
        </p>

        {/* Home link */}
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
