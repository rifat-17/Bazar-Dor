
"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();

  // Email and password signup
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে!");
        return;
      }

      toast.success("রেজিস্ট্রেশন সফল হয়েছে! 🎉");
      router.push("/signin");
    } catch {
      toast.error("রেজিস্ট্রেশন করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "Google দিয়ে সাইন আপ করা যায়নি!"
        );
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google দিয়ে সাইন আপ করা যায়নি। আবার চেষ্টা করুন।");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="card bg-white border border-gray-200 shadow-lg w-full max-w-md">
        <div className="card-body p-6 sm:p-8">
          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              অ্যাকাউন্ট তৈরি করুন
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              বাজার দর-এ আপনাকে স্বাগতম
            </p>
          </div>

          {/* Google Signup */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={googleLoading || loading}
            className="btn btn-outline w-full gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          >
            {googleLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <svg
                className="w-5 h-5"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.01 13.22l7.98 6.19C12.88 13.72 17.98 9.5 24 9.5Z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.92 46.98 31.7 46.98 24.55Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.99 28.59A14.4 14.4 0 0 1 10.22 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.53 3.01 10.78l7.98-6.19Z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.02 0-11.12-4.22-13.01-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
                />
              </svg>
            )}

            {googleLoading
              ? "Google দিয়ে রেজিস্ট্রেশন হচ্ছে..."
              : "Google দিয়ে সাইন আপ"}
          </button>

          {/* Divider */}
          <div className="divider text-gray-400 text-sm">
            অথবা ইমেইল দিয়ে
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="form-control">
              <label htmlFor="name" className="label">
                <span className="label-text font-medium">নাম</span>
              </label>

              <input
                id="name"
                type="text"
                placeholder="আপনার নাম"
                className="input input-bordered w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="email" className="label">
                <span className="label-text font-medium">ইমেইল</span>
              </label>

              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-control">
              <label htmlFor="password" className="label">
                <span className="label-text font-medium">পাসওয়ার্ড</span>
              </label>

              <input
                id="password"
                type="password"
                placeholder="কমপক্ষে ৮ অক্ষর"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <label className="label">
                <span className="label-text-alt text-gray-400">
                  কমপক্ষে ৮ অক্ষর
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-success text-white w-full"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  রেজিস্ট্রেশন হচ্ছে...
                </>
              ) : (
                "রেজিস্টার করুন"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            ইতোমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="text-green-600 font-semibold hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
