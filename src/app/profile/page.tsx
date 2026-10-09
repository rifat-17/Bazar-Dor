
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";

import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
  toast,
} from "@heroui/react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Load the current user's name
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
    }
  }, [session]);

  // Update the user's profile
  const handleUpdateUser = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      toast.danger("নাম কমপক্ষে ৩ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
      });

      if (error) {
        toast.danger(error.message || "প্রোফাইল আপডেট করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } catch {
      toast.danger("কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F5F0] px-4">
        <p className="animate-pulse text-gray-500">
          প্রোফাইল লোড হচ্ছে...
        </p>
      </main>
    );
  }

  // User must sign in first
  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F0F5F0] px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            সাইন ইন করুন
          </h1>

          <p className="mt-3 text-sm text-gray-600">
            আপনার প্রোফাইল দেখতে ও আপডেট করতে প্রথমে সাইন ইন করুন।
          </p>

          <Button
            className="mt-6 w-full bg-green-700 font-semibold text-white hover:bg-green-800"
            onPress={() => {
              window.location.href = "/sign-in";
            }}
          >
            সাইন ইন
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0F5F0] px-4 py-12">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Page heading */}
        <div>
          <Link
            href="/"
            className="text-sm font-medium text-green-700 hover:underline"
          >
            ← হোম পেজে ফিরে যান
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            আপনার ব্যক্তিগত তথ্য দেখুন এবং আপডেট করুন।
          </p>
        </div>

        {/* Profile information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {/* User avatar */}
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-800">
              {(session.user.name || session.user.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-gray-900">
                {session.user.name || "ব্যবহারকারী"}
              </h2>

              <p className="break-all text-sm text-gray-500">
                {session.user.email}
              </p>
            </div>
          </div>

          <div className="mb-6 border-t border-gray-100" />

          {/* Edit profile form */}
          <Form onSubmit={handleUpdateUser} className="w-full">
            <Fieldset className="w-full">
              <Fieldset.Legend>প্রোফাইল সেটিংস</Fieldset.Legend>

              <Description>
                আপনার অ্যাকাউন্টের নাম আপডেট করুন।
              </Description>

              <FieldGroup className="mt-5">
                <TextField
                  isRequired
                  name="name"
                  value={name}
                  onChange={setName}
                  validate={(value) => {
                    if (value.trim().length < 3) {
                      return "নাম কমপক্ষে ৩ অক্ষরের হতে হবে";
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

                <TextField name="email" type="email">
                  <Label>ইমেইল ঠিকানা</Label>

                  <Input
                    value={session.user.email}
                    isReadOnly
                    autoComplete="email"
                  />

                  <Description>
                    এই ফর্ম থেকে ইমেইল পরিবর্তন করা যাবে না।
                  </Description>
                </TextField>
              </FieldGroup>

              <Fieldset.Actions className="mt-6">
                <Button
                  type="submit"
                  className="bg-green-700 font-semibold text-white hover:bg-green-800"
                  isDisabled={loading}
                >
                  {loading ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন"}
                </Button>

                <Button
                  type="reset"
                  variant="secondary"
                  isDisabled={loading}
                  onPress={() => setName(session.user.name ?? "")}
                >
                  বাতিল
                </Button>
              </Fieldset.Actions>
            </Fieldset>
          </Form>
        </section>
      </div>
    </main>
  );
}

