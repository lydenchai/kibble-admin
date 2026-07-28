import React from "react";
import { Order } from "@/types/order";

export function formatAddressString(addr: any): string {
  if (!addr) return "Phnom Penh, Cambodia";
  if (typeof addr === "string") return addr;

  const isInvalid = (val?: string) =>
    !val ||
    typeof val !== "string" ||
    val.trim() === "" ||
    ["house number", "street", "village", "commune", "district", "province", "city", "country", "n/a", "undefined", "null"].includes(
      val.trim().toLowerCase()
    );

  const parts: string[] = [];

  if (!isInvalid(addr.fullAddress)) return addr.fullAddress.trim();
  if (!isInvalid(addr.address)) parts.push(addr.address.trim());

  const houseVal = addr.houseNumber || addr.house;
  if (!isInvalid(houseVal)) {
    const h = houseVal.trim();
    parts.push(h.toLowerCase().startsWith("house") || h.toLowerCase().startsWith("#") ? h : `House ${h}`);
  }

  if (!isInvalid(addr.street)) {
    const s = addr.street.trim();
    parts.push(s.toLowerCase().startsWith("st") || s.toLowerCase().startsWith("street") ? s : `St. ${s}`);
  }

  if (!isInvalid(addr.line1)) parts.push(addr.line1.trim());
  if (!isInvalid(addr.line2)) parts.push(addr.line2.trim());
  if (!isInvalid(addr.village)) parts.push(addr.village.trim());
  if (!isInvalid(addr.commune)) parts.push(addr.commune.trim());
  if (!isInvalid(addr.district)) parts.push(addr.district.trim());

  const provVal = addr.province || addr.city || addr.state;
  if (!isInvalid(provVal)) parts.push(provVal.trim());

  if (!isInvalid(addr.zipCode || addr.zip)) parts.push(addr.zipCode || addr.zip);
  if (!isInvalid(addr.country)) parts.push(addr.country.trim());

  return parts.length > 0 ? parts.join(", ") : "Orchide Village, Sangkat Ou Baek K'am, Khan Sen Sok, Phnom Penh, Cambodia";
}

export function getPaymentMethodLabel(method?: string): string {
  if (!method) return "🏦 ABA KHQR Pay";
  const m = method.toLowerCase();
  if (m.includes("cod") || m.includes("cash")) return "💵 Cash on Delivery (COD)";
  if (m.includes("aba") || m.includes("qr")) return "🏦 ABA KHQR Pay";
  if (m.includes("bank")) return "🏛️ Direct Bank Transfer";
  if (m.includes("card") || m.includes("stripe")) return "💳 Credit / Debit Card";
  return method.toUpperCase();
}

export default function PrintableAdminReceipt({ order }: { order: Order }) {
  if (!order) return null;

  const customerName =
    order.user?.name ||
    (order.shippingAddress as any)?.fullName ||
    (order.shippingAddress as any)?.recipientName ||
    "Customer";

  const customerEmail =
    order.user?.email ||
    (order.shippingAddress as any)?.email ||
    null;

  const customerPhone =
    order.user?.phone ||
    (order.shippingAddress as any)?.phone ||
    null;

  const formattedAddress = formatAddressString(order.shippingAddress);

  return (
    <div className="hidden print:block p-8 bg-white text-stone-900 font-sans text-xs leading-normal">
      {/* Receipt Header */}
      <div className="flex justify-between items-start border-b-2 border-stone-900 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-stone-900">
            KIBBLE PET STORE
          </h1>
          <p className="text-xs font-bold text-stone-600">Official Admin Sales Receipt & Tax Invoice</p>
          <p className="text-[11px] text-stone-500 mt-1">Phnom Penh, Cambodia • Contact: admin@kibble.com</p>
        </div>

        <div className="text-right">
          <h2 className="text-lg font-bold font-mono text-stone-900">
            INVOICE #{order._id.substring(order._id.length - 8).toUpperCase()}
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Date: {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <span className="inline-block border border-stone-900 px-2 py-0.5 font-extrabold uppercase text-[10px] mt-1">
            Status: {order.status}
          </span>
        </div>
      </div>

      {/* Customer, Address & Payment Details */}
      <div className="grid grid-cols-3 gap-6 border-b border-stone-200 pb-6 mb-6">
        <div>
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-500 mb-1">Customer Account</h3>
          <p className="font-black text-sm text-stone-900">{customerName}</p>
          {customerEmail && <p className="text-stone-700">{customerEmail}</p>}
          {customerPhone && <p className="text-stone-700">{customerPhone}</p>}
        </div>

        <div>
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-500 mb-1">Shipping Destination</h3>
          <p className="text-stone-800 font-medium leading-relaxed">
            {formattedAddress}
          </p>
        </div>

        <div>
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-stone-500 mb-1">Payment Method</h3>
          <p className="font-black text-sm text-stone-900">
            {getPaymentMethodLabel(order.paymentMethod)}
          </p>
          <p className="text-stone-600 text-[11px] mt-1">
            Payment Status: <span className="font-black text-stone-900 uppercase">{order.paymentStatus || "Pending"}</span>
          </p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-left border-collapse mb-6">
        <thead>
          <tr className="border-b-2 border-stone-900 text-[11px] uppercase font-black text-stone-700">
            <th className="py-2">Item Name & SKU</th>
            <th className="py-2 text-center">Qty</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200">
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td className="py-3 font-extrabold text-stone-900">
                {item.name}
              </td>
              <td className="py-3 text-center font-bold">{item.quantity}</td>
              <td className="py-3 text-right font-mono">${item.price.toFixed(2)}</td>
              <td className="py-3 text-right font-mono font-black">
                ${(item.price * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Summary */}
      <div className="flex justify-end border-t-2 border-stone-900 pt-4 mb-8">
        <div className="w-64 space-y-2 text-xs">
          <div className="flex justify-between text-stone-700">
            <span>Subtotal:</span>
            <span className="font-mono font-bold">${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-stone-900 font-bold">
              <span>Discount:</span>
              <span className="font-mono">-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-stone-700">
            <span>Shipping:</span>
            <span className="font-mono font-bold">${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-stone-700">
            <span>Tax (8%):</span>
            <span className="font-mono font-bold">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-stone-900 pt-2 text-sm font-black">
            <span>TOTAL PAID:</span>
            <span className="font-mono text-base">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-dashed border-stone-400 pt-6 text-center text-stone-500 text-[11px]">
        <p className="font-extrabold text-stone-800">Kibble Admin Order Record</p>
        <p className="mt-0.5">Printed for internal archive & shipping fulfillment reference.</p>
      </div>
    </div>
  );
}
