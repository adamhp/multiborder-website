"use client";
import { FormEvent, useState } from "react";
import { Button } from "./Button";
import { TextArea, TextField } from "./Fields";

export function FeedbackForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(
        formData as unknown as Record<string, string>,
      ).toString(),
    })
      .then((res) => {
        console.log("success", res);
        setSuccess(true);
        const form: HTMLFormElement = document.getElementById(
          "feedback-form",
        ) as HTMLFormElement;
        form.reset();
      })
      .catch((err) => {
        console.log("failure", err);
        setSuccess(false);
        setError(err);
      });
  };

  return (
    <form
      id="feedback-form"
      name="feedback"
      className="flex flex-col items-center w-full mx-auto max-w-xl space-y-4"
      data-netlify
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="feedback" />
      <TextField
        name="email"
        type="email"
        aria-label="Email address"
        placeholder="(Optional) Email address if you want a reply or need help"
        autoComplete="email"
        className="w-full min-w-0 shrink"
      />
      <TextArea
        name="feedback"
        aria-label="Feedback"
        placeholder="Feedback, kind words, bug reports, and more :)"
        required
        rows={4}
        className="w-full min-w-0 shrink"
      />
      <Button type="submit" color="amber" className="w-40 self-end">
        <span className="hidden lg:inline">Submit</span>
        <span className="lg:hidden">Submit</span>
      </Button>
      {success && (
        <p className="mt-4 text-green-600">Successfully submitted!</p>
      )}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </form>
  );
}
