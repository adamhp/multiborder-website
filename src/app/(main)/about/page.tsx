import { Container } from "@/components/Container";
import meandrue from "@/images/meandrue.png";
import Image from "next/image";
import { appUrl } from "@/constants";
import Link from "next/link";
import { Button } from "@/components/Button";
import kofibit from "@/images/kofibit.png";

export default function About() {
  return (
    <Container>
      <h1 className="text-3xl">About</h1>
      <div className="flex flex-col items-center max-w-2xl py-16 mx-auto">
        <div className="relative aspect-square w-80 flex-none overflow-hidden rounded-xl sm:rounded-2xl mb-12">
          <Image
            src={meandrue}
            alt="me and my dog"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <p>
            My name’s Adam (and this is me and my dog Rue). I made this app
            because I was unsatisfied with all of the available free options in
            the app store. Either they required too much work for every single
            photo or they locked important features behind paywalls. I’m a
            hobbyist photographer and I simply wanted to upload 4:5 or square
            photos to Instagram while preserving the native aspect ratio of my
            camera’s photos. Thus, multiborder was born!
          </p>
          <p>
            If you find multiborder useful, I’d love to hear from you! You can
            use the <Link href="/feedback">Feedback form</Link>. You could also
            help me out by leaving a review on the{" "}
            <a href={appUrl}>App Store</a> or{" "}
            <a href="https://ko-fi.com/X7X3RSONC" target="_blank">
              supporting me on Ko-fi!{" "}
              <Image
                className="inline"
                src={kofibit}
                height={36}
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
          </p>
        </div>
        <Button href="/" variant="outline" className="mt-16">
          Back to main page
        </Button>
      </div>
    </Container>
  );
}
