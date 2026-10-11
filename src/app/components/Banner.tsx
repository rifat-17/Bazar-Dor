
import { Button } from "@heroui/react";
import Image from "next/image";
import BannerImg from "@/assets/bazar-hero.png";
import Link from "next/link";
import { getBanglaDate } from "@/lib/utils";

const Banner = () => {
  const date = new Date().toLocaleDateString("bn-BD", {
    dateStyle: "full",
  });

  return (
    <section className=" mt-7 rounded-3xl border mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
      {/* Left content */}
      <div className="space-y-4">
        {/* Eyebrow / Date */}
        <p className="inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">

          {getBanglaDate()}

        </p>

        {/* Main heading */}
        <h1 className="text-3xl font-bold  text-gray-900 ">
          আজকের বাজারের দাম এক নজরে
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-base  text-gray-600 ">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
          বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং
          দামের পরিবর্তন এক জায়গায়।
        </p>

        {/* CTA */}
        <Link href={'#সব-পণ্য'}>
          <Button


            variant="danger"
            className="font-semibold text-white bg-green-700"
            size="lg"
          >
            সব পণ্য দেখুন ↓
          </Button>
        </Link>

      </div>

      {/* Right side image */}
      <div className="relative flex justify-center md:justify-end">
        <Image
          src={BannerImg}
          alt="বাজারের নিত্যপ্রয়োজনীয় পণ্য"
          width={450}
          height={450}
          priority
          className="h-auto w-full max-w-md object-contain"
        />
      </div>
    </section>
  );
};

export default Banner;