import classNames from 'clsx';

const featuredTestimonial = {
  body: 'Absolutely perfect app, does exactly what you need it to do. Nothing more, nothing less.',
  author: {
    handle: 'shawn_buso',
  },
};
const testimonials = [
  [
    [
      {
        body: 'Intuitive and useful. Been needing something like this for a while now, very easy to use and isn’t bloated with microtransactions and ads. Perfect app.',
        author: {
          handle: 'DoctorBoyong',
        },
      },
      {
        body: 'Intuitive Tool. Easy to use and produces a beautiful end result',
        author: {
          handle: '_hugirl',
        },
      },
    ],
    [
      {
        body: 'Found your multiborder app from a Reddit post and will use this for life! Super simple and free app?? You are a man of the people ;_; <3 Appreciate you!!',
        author: {
          handle: 'Livi',
        },
      },
    ],
  ],
  [
    [
      {
        body: 'Sweet app, thanks for sharing it!',
        author: {
          handle: 'Evan',
        },
      },
    ],
    [
      {
        body: 'Thank you!! Exactly what I need!!',
        author: {
          handle: 'Tom',
        },
      },
      {
        body: 'This is exactly what I needed without all the extra features I won’t use! Thank you!',
        author: {
          handle: 'Jenna',
        },
      },
    ],
  ],
];

export function Reviews() {
  return (
    <div className='relative isolate pt-24 pb-32 sm:pt-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-base/7 font-semibold text-amber-600 dark:text-amber-600'>
            Testimonials
          </h2>
          <p className='mt-2 text-4xl tracking-tight text-balance text-stone-800 sm:text-5xl dark:text-white'>
            Read the reviews
          </p>
        </div>
        <div className='mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm/6 text-stone-800 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4 dark:text-stone-100'>
          <figure className='rounded-2xl bg-stone-100 shadow-lg ring-1 ring-stone-800/5 sm:col-span-2 xl:col-start-2 xl:row-end-1 dark:bg-stone-800/75 dark:shadow-none dark:ring-white/10'>
            <blockquote className='p-6 text-lg font-semibold tracking-tight text-stone-800 sm:p-12 sm:text-xl/8 dark:text-white'>
              <p>{`“${featuredTestimonial.body}”`}</p>
            </blockquote>
            <figcaption className='flex flex-wrap items-center gap-x-4 gap-y-4 border-t border-stone-800/10 px-6 py-4 sm:flex-nowrap dark:border-white/10'>
              <div className='flex-auto'>
                <div className='text-stone-600 dark:text-stone-400'>{`@${featuredTestimonial.author.handle}`}</div>
              </div>
            </figcaption>
          </figure>
          {testimonials.map((columnGroup, columnGroupIdx) => (
            <div
              key={columnGroupIdx}
              className='space-y-8 xl:contents xl:space-y-0'
            >
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={classNames(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === testimonials.length - 1 &&
                        columnIdx === columnGroup.length - 1)
                      ? 'xl:row-span-2'
                      : 'xl:row-start-1',
                    'space-y-8',
                  )}
                >
                  {column.map((testimonial) => (
                    <figure
                      key={testimonial.author.handle}
                      className='rounded-2xl bg-stone-100 p-6 shadow-lg ring-1 ring-stone-800/5 dark:bg-stone-800/75 dark:shadow-none dark:ring-white/10'
                    >
                      <blockquote className='text-stone-800 dark:text-white'>
                        <p>{`“${testimonial.body}”`}</p>
                      </blockquote>
                      <figcaption className='mt-6 flex items-center gap-x-4'>
                        <div>
                          <div className='text-stone-600 dark:text-stone-400'>{`@${testimonial.author.handle}`}</div>
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
