export type ReviewSource = 'App Store' | 'Ko-fi';
export type Review = { body: string; author: string; source: ReviewSource };

// Combined average across the US, UK and Australian stores. Apple's public
// lookup API reports one country at a time, so this is updated by hand.
export const appStoreRating = 4.6;

const shawn: Review = {
  body: 'Absolutely perfect app, does exactly what you need it to do. Nothing more, nothing less.',
  author: '@shawn_buso',
  source: 'App Store',
};
const doctorBoyong: Review = {
  body: 'Intuitive and useful. Been needing something like this for a while now, very easy to use and isn’t bloated with microtransactions and ads. Perfect app.',
  author: '@DoctorBoyong',
  source: 'App Store',
};
const hugirl: Review = {
  body: 'Intuitive Tool. Easy to use and produces a beautiful end result',
  author: '@_hugirl',
  source: 'App Store',
};
const livi: Review = {
  body: 'Found your multiborder app from a Reddit post and will use this for life! Super simple and free app?? You are a man of the people ;_; <3 Appreciate you!!',
  author: 'Livi',
  source: 'Ko-fi',
};
const evan: Review = {
  body: 'Sweet app, thanks for sharing it!',
  author: 'Evan',
  source: 'Ko-fi',
};
const tom: Review = {
  body: 'Thank you!! Exactly what I need!!',
  author: 'Tom',
  source: 'Ko-fi',
};
const jenna: Review = {
  body: 'This is exactly what I needed without all the extra features I won’t use! Thank you!',
  author: 'Jenna',
  source: 'Ko-fi',
};

export const featuredReview = shawn;

// Column groups → columns → reviews, laid out by the /reviews grid.
export const reviewColumns: Review[][][] = [
  [[doctorBoyong, hugirl], [livi]],
  [[evan], [tom, jenna]],
];

// Every review, for the home page marquee.
export const allReviews: Review[] = [shawn, doctorBoyong, hugirl, livi, evan, tom, jenna];
