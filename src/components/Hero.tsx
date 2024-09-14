import Image from "next/image";
import Link from "next/link";
import { useId } from "react";

import { AppDemo } from "@/components/AppDemo";
import { AppStoreLink } from "@/components/AppStoreLink";
import { Container } from "@/components/Container";
import { PhoneFrame } from "@/components/PhoneFrame";
import qrCode from "@/images/qr-code.png";
import { appUrl } from "../constants";
import { NewsletterSignup } from "./NewsletterSignup";

function QrCodeBorder(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true" {...props}>
      <path
        d="M1 17V9a8 8 0 0 1 8-8h8M95 17V9a8 8 0 0 0-8-8h-8M1 79v8a8 8 0 0 0 8 8h8M95 79v8a8 8 0 0 1-8 8h-8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackgroundIllustration(props: React.ComponentPropsWithoutRef<"div">) {
  const id = useId();

  return (
    <div {...props}>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-slow"
      >
        <path
          d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M513 1025C230.23 1025 1 795.77 1 513"
          stroke={`url(#${id}-gradient-1)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-1`}
            x1="1"
            y1="513"
            x2="1"
            y2="1025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#d97706" />
            <stop offset="1" stopColor="#d97706" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg
        viewBox="0 0 1026 1026"
        fill="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-spin-reverse-slower"
      >
        <path
          d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
          stroke="#D4D4D4"
          strokeOpacity="0.7"
        />
        <path
          d="M913 513c0 220.914-179.086 400-400 400"
          stroke={`url(#${id}-gradient-2)`}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id={`${id}-gradient-2`}
            x1="913"
            y1="513"
            x2="913"
            y2="913"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#d97706" />
            <stop offset="1" stopColor="#d97706" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <div className="overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="lg:hidden relative -mt-24">
            <BackgroundIllustration className="absolute left-1/2 top-4 h-[700px] w-[700px] -translate-x-1/2 stroke-stone-400/70 [mask-image:linear-gradient(to_bottom,white_10%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg: xl:-top-14 xl:ml-0" />
            <div className="h-[700px] px-9 lg:[mask-image:linear-gradient(to_bottom,white_80%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-32 lg:h-auto lg:px-0 lg:-bottom-32">
              <PhoneFrame className="mx-auto max-w-[393px]" priority>
                <AppDemo />
              </PhoneFrame>
            </div>
          </div>
          <div className="mt-32 lg:mt-0 relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <h1 className="text-3xl text-center lg:text-4xl lg:text-left font-medium tracking-tight text-stone-100">
              Easily add borders to multiple images
            </h1>
            <p className="mt-6 text-lg text-stone-300">
              Multiborder is an iOS app that makes adding borders to multiple
              images quick and easy. With just a few taps, adjust aspect ratio,
              border size, and color, then download the results for seamless
              sharing.
            </p>
            <div className="my-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 lg:hidden">
              <AppStoreLink />
            </div>
            <div className="mt-8 hidden group relative -mx-4 lg:flex items-center p-4 transition-colors bg-stone-900 hover:bg-stone-700 sm:self-auto sm:rounded-2xl lg:mx-0 lg:p-6 w-min">
              <div className="relative flex h-24 w-24 flex-none items-center justify-center">
                <QrCodeBorder className="absolute -inset-2 h-28 w-28 stroke-stone-300 transition-colors group-hover:stroke-amber-500" />
                <Image src={qrCode} alt="" unoptimized />
              </div>
              <div className="ml-8 lg:w-64">
                <p className="text-base font-semibold text-stone-100">
                  <Link href={appUrl}>
                    <span className="absolute inset-0" />
                    Download the app
                  </Link>
                </p>
                <p className="mt-1 text-sm text-stone-300">
                  Click here or scan the QR code to download the app from the
                  App Store.
                </p>
              </div>
            </div>
          </div>
          <div className="hidden relative lg:block mt-10 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <BackgroundIllustration className="absolute left-1/2 top-4 h-[700px] w-[700px] -translate-x-1/2 stroke-stone-400/70 [mask-image:linear-gradient(to_bottom,white_10%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg: xl:-top-14 xl:ml-0" />
            <div className="h-[700px] px-9 lg:[mask-image:linear-gradient(to_bottom,white_80%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-32 lg:h-auto lg:px-0 lg:-bottom-32">
              <PhoneFrame className="mx-auto max-w-[393px]" priority>
                <AppDemo />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </Container>
      <div className="mt-32">
        <NewsletterSignup />
      </div>
    </div>
  );
}
