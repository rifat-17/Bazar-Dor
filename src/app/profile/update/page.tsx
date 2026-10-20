"use client";

import { useRef, useState } from "react";
import { useSession, authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

export default function UpdateProfilePage() {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim();
    if (!name) {
      toast.error("অনুগ্রহ করে আপনার নাম লিখুন।");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({ name });

      if (error) {
        toast.error(error.message || "আপডেট ব্যর্থ হয়েছে!");
        return;
      }

      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে! 🎉");
      router.push("/profile");
    } catch {
      toast.error("আপডেট করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-gray-500 mb-4">আপনি লগইন করেননি</p>
        <Link href="/signin" className="btn btn-success text-white">
          সাইন ইন করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">তথ্য আপডেট করুন</h1>

      <div className="card bg-white border shadow">
        <div className="card-body">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="form-control">
              <label className="label" htmlFor="name">
                <span className="label-text font-medium">নাম</span>
              </label>
              <input
                id="name"
                ref={nameRef}
                type="text"
                placeholder="আপনার নাম"
                className="input input-bordered w-full"
                defaultValue={session.user.name ?? ""}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success text-white w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "আপডেট করুন"
              )}
            </button>
          </form>

          <Link href="/profile" className="btn btn-ghost w-full mt-2">
            ← প্রোফাইলে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}
