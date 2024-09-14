import { Container } from "@/components/Container";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Button } from "@/components/Button";
import kofibit from "@/images/kofibit.png";
import Image from "next/image";

export default function Feedback() {
  return (
    <>
      <Container>
        <h1 className="text-3xl">Feedback</h1>
        <div className="flex flex-col items-center max-w-2xl py-16 mx-auto">
          <FeedbackForm />
          <Button href="/" variant="outline" className="mt-16">
            Back to main page
          </Button>
          <p className="mt-12 text-center">
            If you’ve enjoyed using multiborder, consider leaving a review and{" "}
            <a href="https://ko-fi.com/X7X3RSONC" target="_blank">
              supporting me on Ko-fi!
              <Image
                className="inline"
                src={kofibit}
                height={36}
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </a>
          </p>
        </div>
      </Container>
    </>
  );
}
