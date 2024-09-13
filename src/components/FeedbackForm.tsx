'use client';
import { FormEvent } from 'react';
import { Button } from './Button';
import { TextArea, TextField } from './Fields';

export function FeedbackForm() {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch('/__forms.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(
        formData as unknown as Record<string, string>,
      ).toString(),
    });
    // Success & error handling should come here
  };

  return (
    <form
      name='feedback'
      className='flex flex-col items-center w-full mx-auto max-w-xl space-y-4'
      data-netlify
      onSubmit={handleSubmit}
    >
      <input type='hidden' name='form-name' value='feedback' />
      <h1 className='text-stone-100 text-3xl mb-8'>Feedback</h1>
      <TextField
        type='email'
        aria-label='Email address'
        placeholder='(Optional) Email address if you want a reply'
        autoComplete='email'
        className='w-full min-w-0 shrink'
      />
      <TextArea
        aria-label='Feedback'
        placeholder='Feedback, kind words, bug reports, and more :)'
        required
        rows={4}
        className='w-full min-w-0 shrink'
      />
      <Button type='submit' color='amber' className='w-40 self-end'>
        <span className='hidden lg:inline'>Submit</span>
        <span className='lg:hidden'>Submit</span>
      </Button>
    </form>
  );
}
