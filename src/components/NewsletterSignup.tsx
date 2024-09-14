"use client";

import { Button } from "./Button";
import { TextField } from "./Fields";

export function NewsletterSignup() {
  const handleSubmit = () => {
    window.open("https://buttondown.com/multiborder", "popupwindow");
    (document.getElementById("buttondown-signup") as HTMLFormElement).submit();
  };
  return (
    <div className="flex flex-col items-center justify-center gap-y-12 lg:flex-row lg:items-center p-12">
      <div className="flex flex-col items-center py-16">
        <p className="text-center text-stone-300 mb-4 max-w-sm">
          Signup to our newsletter to receive updates about new features
        </p>
        <form
          id="buttondown-signup"
          name="buttondown-signup"
          className="embeddable-buttondown-form flex w-full justify-center md:w-auto"
          action="https://buttondown.com/api/emails/embed-subscribe/multiborder"
          method="post"
          target="popupwindow"
          onSubmit={handleSubmit}
        >
          <TextField
            type="email"
            aria-label="Email address"
            placeholder="Email address"
            id="bd-email"
            autoComplete="email"
            required
            className="w-80 min-w-0 shrink"
          />
          <Button
            type="submit"
            // value='Subscribe'
            color="amber"
            className="ml-4 flex-none"
          >
            <span className="hidden lg:inline">Stay up-to-date</span>
            <span className="lg:hidden">Stay up-to-date</span>
          </Button>
        </form>
        <p className="text-sm text-center text-stone-100 mt-2">
          <a href="https://buttondown.com/refer/multiborder" target="_blank">
            Powered by Buttondown.
          </a>
        </p>
      </div>
    </div>
  );
}
