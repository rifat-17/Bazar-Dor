
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleEmailSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn.email({
        email,
        password,
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error(error.message || "সাইন ইন ব্যর্থ হয়েছে!");
        return;
      }

      toast.success("সাইন ইন সফল হয়েছে! 🎉");
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error("সাইন ইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: '/',
      });

      if (error) {
        toast.error(error.message || "Google দিয়ে সাইন ইন ব্যর্থ হয়েছে!");
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Google দিয়ে সাইন ইন করা যায়নি। আবার চেষ্টা করুন।");
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
              সাইন ইন করুন
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              আপনার অ্যাকাউন্টে প্রবেশ করুন
            </p>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="btn btn-outline w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
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
              ? "Google দিয়ে সাইন ইন হচ্ছে..."
              : "Google দিয়ে সাইন ইন"}
          </button>

          {/* Divider */}
          <div className="divider text-gray-400 text-sm">
            অথবা ইমেইল দিয়ে
          </div>

          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
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
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success text-white w-full"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm" />
                  সাইন ইন হচ্ছে...
                </>
              ) : (
                "সাইন ইন"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-4">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="text-green-600 font-semibold hover:underline"
            >
              রেজিস্টার করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
