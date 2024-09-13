import { Container } from '@/components/Container';
import { TextArea, TextField } from '@/components/Fields';
import { Button } from '@/components/Button';

export default function Feedback() {
  return (
    <Container>
      <div className='overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36'>
        <form
          className='flex flex-col items-center w-full mx-auto max-w-xl space-y-4'
          data-netlify
        >
          <h1 className='text-stone-100 text-3xl mb-8'>Feedback</h1>
          <TextArea
            aria-label='Feedback'
            placeholder='Feedback, kind words, bug reports, and more :)'
            required
            rows={4}
            className='w-full min-w-0 shrink'
          />
          <TextField
            type='email'
            aria-label='Email address'
            placeholder='(Optional) Email address if you want a reply'
            autoComplete='email'
            className='w-full min-w-0 shrink'
          />
          <Button type='submit' color='amber' className='w-40 self-end'>
            <span className='hidden lg:inline'>Submit</span>
            <span className='lg:hidden'>Submit</span>
          </Button>
        </form>
      </div>
    </Container>
  );
}
