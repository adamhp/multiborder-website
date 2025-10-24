import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Reviews } from '@/components/Reviews';
import { QrDownload } from '../../../components/QrDownload';

export default function ReviewsPage() {
  return (
    <Container>
      <section
        id='reviews'
        aria-label='Reviews'
        className='bg-stone-800 md:pt-8 pb-12 sm:pb-32'
      >
        <Reviews />
        <Container className='hidden md:mt-20 md:block'></Container>
        <div className='hidden md:block mt-24 w-min mx-auto'>
          <QrDownload />
        </div>
        <div className='flex flex-row items-center justify-center'>
          <Button href='/' variant='outline' className='mt-16'>
            Back to main page
          </Button>
        </div>
      </section>
    </Container>
  );
}
