import Invoice from "@/components/booking/Invoice";
import { notFound } from "next/navigation";
import { API_BASE_URL } from "@/constants/api";
import "@/components/booking/booking.css";

export default async function InvoiceRenderPage(props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const id = params.id;
  const secret = searchParams.secret;

  if (secret !== "canonical-render-secret") {
    return <div style={{ padding: 20 }}>Forbidden</div>;
  }

  const backendUrl = API_BASE_URL ? API_BASE_URL.replace("/api", "") : "http://localhost:5000";
  const res = await fetch(`${backendUrl}/api/booking/internal-render/${id}?secret=canonical-render-secret&_t=${Date.now()}`, { cache: "no-store" });
  
  if (!res.ok) {
    return notFound();
  }
  
  const { data: rawData } = await res.json();
  
  const tickets = (rawData.items || []).map(item => {
    let pricingType = "REGULAR";
    let components = null;

    if (rawData.sessionItems) {
      const sItem = rawData.sessionItems.find(si => si.item_name === item.item_name && si.item_type === item.item_type);
      if (sItem) {
        pricingType = sItem.pricing_type || "REGULAR";
        if (pricingType === "OFFER" && rawData.sessionComponents) {
          const sComps = rawData.sessionComponents.filter(c => c.session_item_id === sItem.id);
          components = sComps.map(c => {
            const tDef = (rawData.ticketsMetadata || []).find(t => t.id === c.ticket_type_id);
            return {
              componentType: c.component_type,
              ticketTypeId: c.ticket_type_id,
              name: tDef ? tDef.name : '',
              quantity: c.quantity
            };
          });
        }
      }
    }

    return {
      id: item.id,
      ticketType: item.item_name,
      name: item.item_name,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      amount: item.subtotal || item.total_price,
      totalPrice: item.subtotal || item.total_price,
      pricingType: pricingType,
      components: components,
      itemType: item.item_type === "TICKET" ? "Ticket" : 
                item.item_type === "MEAL" || item.item_type === "ADDON" ? "Ticket" : "Ticket"
    };
  });

  const booking = {
    bookingId: rawData.id,
    bookingNumber: rawData.booking_number,
    invoiceNo: rawData.invoice_number,
    bookingDate: new Date(rawData.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" }),
    visitDate: new Date(rawData.visit_date).toLocaleDateString("en-IN", { dateStyle: "medium" }),
    customer: {
      name: rawData.guest_name,
      email: rawData.guest_email,
      phone: rawData.guest_mobile
    },
    grandTotal: rawData.grand_total,
    subtotal: Number(rawData.ticket_subtotal || 0) + Number(rawData.meal_subtotal || 0),
    discount: rawData.total_discount,
    tax: rawData.total_tax,
    bookingResult: {
      qr_token: rawData.unmasked_qr_token
    },
    quote: {
      ticketTax: Number(rawData.ticket_tax) || 0,
      addonTax: Number(rawData.food_tax) || 0,
      convenienceFee: Number(rawData.convenience_fee) || 0,
      totalDiscount: Number(rawData.total_discount) || 0,
      grandTotal: Number(rawData.grand_total) || 0,
    },
    tickets: tickets
  };
  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", background: "white" }}>
      <Invoice booking={booking} />
    </div>
  );
}
