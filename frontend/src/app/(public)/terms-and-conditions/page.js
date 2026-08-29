import LegalPageLayout from '@/components/layout/LegalPageLayout';

export const metadata = {
  title: "Terms & Conditions — VGP Universal Kingdom",
  description: "Terms and conditions for VGP Universal Kingdom.",
};

export default function TermsAndConditions() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="August 26, 2026">
      <section>
        <h2>1. General Park Rules</h2>
        <ul>
          <li>Management reserves the right of admission.</li>
          <li>Tickets once purchased are non-refundable and non-transferable.</li>
          <li>Outside food and beverages are strictly prohibited inside the park premises.</li>
          <li>Visitors must follow all safety instructions provided by the park staff and ride operators.</li>
        </ul>
      </section>

      <section>
        <h2>2. Booking &amp; Ticketing</h2>
        <ul>
          <li>E-tickets must be presented at the entry gate along with a valid photo ID.</li>
          <li>Offers and discounts cannot be clubbed together unless specified otherwise.</li>
          <li>Children below 90 cm in height get free entry.</li>
          <li>Senior citizens must carry age proof for availing senior citizen discounts.</li>
        </ul>
      </section>

      <section>
        <h2>3. Ride Safety</h2>
        <ul>
          <li>Certain rides have height, weight, and health restrictions. Please check the signage before entering.</li>
          <li>Pregnant women and individuals with heart conditions or back problems should avoid thrill rides.</li>
        </ul>
      </section>
      
      <p style={{ marginTop: '24px' }}>
        For any queries regarding these terms, please contact our support team.
      </p>
    </LegalPageLayout>
  );
}
