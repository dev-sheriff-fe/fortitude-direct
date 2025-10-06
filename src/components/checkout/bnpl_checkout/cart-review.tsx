// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Lock, Tag } from "lucide-react";
// import { useCart } from "@/store/cart";
// import { formatPrice } from "@/utils/helperfns";
// // import sofaImage from "@/assets/sofa.jpg";
// // import deskImage from "@/assets/desk.jpg";

// interface CartItem {
//   id: string;
//   name: string;
//   image: string;
//   price: number;
//   quantity: number;
// }

// export const CartReview = () => {
//   const [discountCode, setDiscountCode] = useState("");
//   const {cart} = useCart()
//   const [items] = useState<CartItem[]>([
//     {
//       id: "1",
//       name: "DuoComfort Sofa Premium",
//       image: '/file.svg',
//       price: 20.00,
//       quantity: 1,
//     },
//     {
//       id: "2",
//       name: "IronOne Desk",
//       image: '/window.svg',
//       price: 25.00,
//       quantity: 1,
//     },
//   ]);
//   const [checkoutData,setCheckoutData] = useState<any>(null)
//        useEffect(() => {
//       const stored = sessionStorage.getItem('checkout');
//       if (stored) {
//         setCheckoutData(JSON.parse(stored));
//       }
//     }, []);

//     console.log(checkoutData);
    

//   const subtotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
//   const shipping = 0;
//   const discount = 0;
//   const total = subtotal + shipping + discount;

//   const handleApplyDiscount = () => {
//     // Handle discount code application
//     console.log("Applying discount code:", discountCode);
//   };

//   return (
//     <div className="w-full h-fit sticky top-4">
//       <h2 className="text-lg font-medium text-checkout-text mb-6">Review your cart</h2>
      
//       {/* Cart Items */}
//       <div className="space-y-4 mb-6">
//         {cart.map((item) => (
//           <div key={item.id} className="flex items-center gap-4 p-4 bg-checkout-bg-subtle rounded-lg">
//             <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
//               <img
//                 src={item.picture||'/placeholder.svg'}
//                 alt={item.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="flex-1">
//               <h3 className="font-medium text-checkout-text">{item.name}</h3>
//               <p className="text-sm text-checkout-text-muted">{item.quantity}x</p>
//             </div>
//             <div className="text-checkout-text font-semibold">
//               {formatPrice(item?.salePrice, checkoutData?.ccy)}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Discount Code */}
//       <div className="mb-6">
//         {/* <div className="flex gap-2">
//           <div className="relative flex-1">
//             <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-checkout-text-muted" />
//             <Input
//               placeholder="Discount code"
//               value={discountCode}
//               onChange={(e) => setDiscountCode(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <Button variant="outline" onClick={handleApplyDiscount} className="px-6">
//             Apply
//           </Button>
//         </div> */}
//       </div>

//       {/* Order Summary */}
//       <div className="space-y-3 mb-6 p-4 bg-checkout-bg-subtle rounded-lg">
//         <div className="flex justify-between text-checkout-text-muted">
//           <span>Subtotal</span>
//           <span>{formatPrice(subtotal,checkoutData?.ccy)}</span>
//         </div>
//         <div className="flex justify-between text-checkout-text-muted">
//           <span>Shipping</span>
//           <span>{formatPrice(shipping,checkoutData?.ccy)}</span>
//         </div>
//         <div className="flex justify-between text-checkout-text-muted">
//           <span>Discount</span>
//           <span>{formatPrice(discount,checkoutData?.ccy)}</span>
//         </div>
//         <div className="border-t pt-3">
//           <div className="flex justify-between font-semibold text-checkout-text text-lg">
//             <span>Total</span>
//             <span>{formatPrice(total,checkoutData?.ccy)}</span>
//           </div>
//         </div>
//       </div>

//       {/* Pay Now Button
//       <Button className="w-full h-12 text-base font-medium mb-4">
//         Pay Now
//       </Button> */}

//       {/* Security Notice */}
//       <div className="flex items-start gap-3 p-4 bg-checkout-bg-subtle rounded-lg">
//         <Lock className="w-4 h-4 text-checkout-success mt-0.5 flex-shrink-0" />
//         <div>
//           <h4 className="font-medium text-checkout-text text-sm">
//             Secure Checkout - SSL Encrypted
//           </h4>
//           <p className="text-xs text-checkout-text-muted mt-1">
//             Ensuring your financial and personal details are secure during every transaction.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Tag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/utils/helperfns";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CartReviewProps {
  selectedShippingOption?: {
    id: string;
    name: string;
    price: number;
  };
  shippingMethod?: "delivery" | "pickup";
}

export const CartReview = ({ selectedShippingOption, shippingMethod = "delivery" }: CartReviewProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const { cart } = useCart();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  
  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);

  const shipping = shippingMethod === "delivery" && selectedShippingOption ? selectedShippingOption.price : 0;
  
  const discount = 0;
  const total = subtotal + shipping + discount;

  const handleApplyDiscount = () => {
    console.log("Applying discount code:", discountCode);
  };

  return (
    <div className="w-full h-fit sticky top-4">
      <h2 className="text-lg font-medium text-checkout-text mb-6">Review your cart</h2>

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 bg-checkout-bg-subtle rounded-lg">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white">
              <img
                src={item.picture || '/placeholder.svg'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-checkout-text">{item.name}</h3>
              <p className="text-sm text-checkout-text-muted">{item.quantity}x</p>
            </div>
            <div className="text-checkout-text font-semibold">
              {formatPrice(item?.salePrice, checkoutData?.ccy)}
            </div>
          </div>
        ))}
      </div>

      {(shippingMethod === "delivery" && selectedShippingOption) && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-checkout-text font-medium">
              Shipping: {selectedShippingOption.name}
            </span>
            <span className="text-checkout-text font-semibold">
              {formatPrice(selectedShippingOption.price, checkoutData?.ccy)}
            </span>
          </div>
        </div>
      )}

      {shippingMethod === "pickup" && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="text-sm text-checkout-text font-medium">
            🚚 Store Pickup - Free
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6 p-4 bg-checkout-bg-subtle rounded-lg">
        <div className="flex justify-between text-checkout-text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, checkoutData?.ccy)}</span>
        </div>
        
        <div className="flex justify-between text-checkout-text-muted">
          <span>Shipping</span>
          <span>
            {shippingMethod === "pickup" 
              ? "Free" 
              : formatPrice(shipping, checkoutData?.ccy)
            }
          </span>
        </div>
        
        <div className="flex justify-between text-checkout-text-muted">
          <span>Discount</span>
          <span>{formatPrice(discount, checkoutData?.ccy)}</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-checkout-text text-lg">
            <span>Total</span>
            <span>{formatPrice(total, checkoutData?.ccy)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-checkout-bg-subtle rounded-lg">
        <Lock className="w-4 h-4 text-checkout-success mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-checkout-text text-sm">
            Secure Checkout - SSL Encrypted
          </h4>
          <p className="text-xs text-checkout-text-muted mt-1">
            Ensuring your financial and personal details are secure during every transaction.
          </p>
        </div>
      </div>
    </div>
  );
};