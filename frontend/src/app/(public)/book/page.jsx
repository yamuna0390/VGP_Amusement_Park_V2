import BookingShell from '../../../components/booking/BookingShell';

export const metadata = {
  title: 'Book Tickets — VGP Universal Kingdom',
  description: 'Book your tickets for VGP Universal Kingdom amusement park. Choose from multiple ticket categories, exclusive offers, and add-ons.',
};

export default async function BookPage({ searchParams }) {
  const params = await searchParams;
  const offerId = params?.offerId || null;
  
  if (offerId) {
    console.log("Intent received for offerId:", offerId);
  }

  return <BookingShell initialOfferId={offerId} />;
}
