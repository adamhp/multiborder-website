import { Container } from '@/components/Container';
import { FeedbackForm } from '../../../components/FeedbackForm';

export default function Feedback() {
  return (
    <Container>
      <div className='overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36'>
        <FeedbackForm />
      </div>
    </Container>
  );
}
