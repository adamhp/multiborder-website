import { Container } from '@/components/Container';

export default function Privacy() {
  return (
    <Container>
      <div className='overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36'>
        <div className='flex flex-col justify-center items-center max-w-md mx-auto'>
          <h1 className='text-center text-xl text-stone-100 mb-4 lg:text-left'>
            multiborder Privacy Policy
          </h1>
          <p className='text-stone-300 text-justify'>
            We do not collect any personal data to use this application, and no
            personal data shared with us will be given to any third party, under
            any circumstances. Your data will also never be used by us for any
            purpose without specific permission. The app engages in no ad
            targeting, data mining, or other activities that may compromise your
            privacy, and we do not affiliate ourselves with any third parties
            that do so.
          </p>
          <p className='mt-4 text-stone-300 text-justify'>
            If you decide to support through Ko-fi, please review{' '}
            <a
              className='text-amber-500 hover:text-amber-600'
              href='https://help.ko-fi.com/hc/en-us/articles/12284014348189-What-personal-information-is-shared-on-Ko-fi-as-supporter#what-personal-information-is-shared-on-ko-fi-as-supporter--0-0'
            >
              this page
            </a>{' '}
            for specifics on their handling of personal information, as well as
            their{' '}
            <a
              className='text-amber-500 hover:text-amber-600'
              href='https://more.ko-fi.com/privacy'
            >
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
