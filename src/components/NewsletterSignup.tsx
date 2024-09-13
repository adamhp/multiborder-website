import { Button } from './Button';
import { TextField } from './Fields';

export function NewsletterSignup() {
  return (
    <div className='flex flex-col items-center justify-center gap-y-12 lg:flex-row lg:items-center p-12'>
      <div className='py-16'>
        <p className='text-center text-stone-300 mb-4'>
          Signup to get notified of new versions, request beta access, and more.
        </p>
        <form className='flex w-full justify-center md:w-auto'>
          <TextField
            type='email'
            aria-label='Email address'
            placeholder='Email address'
            autoComplete='email'
            required
            className='w-80 min-w-0 shrink'
          />
          <Button type='submit' color='amber' className='ml-4 flex-none'>
            <span className='hidden lg:inline'>Stay up-to-date!</span>
            <span className='lg:hidden'>Stay up-to-date</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
