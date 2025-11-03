import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Tag } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/utils/helperfns";
import { CheckoutStep } from "@/app/checkout/checkoutContent";
import { UseFormReturn } from "react-hook-form";

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
  setCurrentStep: (currentStep: CheckoutStep) => void;
  form: UseFormReturn<any>;
  selectedStore?: string;
}

export const CartReview = ({ 
  selectedShippingOption, 
  shippingMethod = "delivery", 
  setCurrentStep,
  form,
  selectedStore
}: CartReviewProps) => {
  const [discountCode, setDiscountCode] = useState("");
  const { cart, getCartTotal, mainCcy } = useCart();
  const [checkoutData, setCheckoutData] = useState<any>(null);

  const { getValues, watch } = form;

  useEffect(() => {
    const stored = sessionStorage.getItem('checkout');
    if (stored) {
      setCheckoutData(JSON.parse(stored));
    }
  }, []);

  const subtotal = getCartTotal();
  const shipping = shippingMethod === "delivery" && selectedShippingOption ? selectedShippingOption.price : 0;
  const discount = 0;
  const total = subtotal + shipping + discount;

  const handleApplyDiscount = () => {
    console.log("Applying discount code:", discountCode);
  };

  const isButtonDisabled = shippingMethod === 'delivery'
    ? !getValues("selectedAddressId") || !getValues("shippingOption")
    : !selectedStore;

  const handleContinueToPayment = () => {
    console.log("Continue to Payment clicked");
    console.log("Form values:", getValues());
    console.log("Selected shipping option:", selectedShippingOption);
    console.log("Shipping method:", shippingMethod);
    console.log("Selected store:", selectedStore);

    const updatedCheckoutData = {
      ...checkoutData,
      shippingFee: shipping,
      totalAmount: total
    };
    
    sessionStorage.setItem('checkout', JSON.stringify(updatedCheckoutData));
    setCurrentStep('cart');
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
              {formatPrice(item?.salePrice, mainCcy() as any)}
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
              {formatPrice(selectedShippingOption.price, mainCcy() as any)}
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
          <span>{formatPrice(subtotal, mainCcy() as any)}</span>
        </div>

        <div className="flex justify-between text-checkout-text-muted">
          <span>Shipping</span>
          <span>
            {shippingMethod === "pickup"
              ? "Free"
              : formatPrice(shipping, mainCcy() as any)
            }
          </span>
        </div>

        <div className="flex justify-between text-checkout-text-muted">
          <span>Discount</span>
          <span>{formatPrice(discount, mainCcy() as any)}</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-checkout-text text-lg">
            <span>Total</span>
            <span>{formatPrice(total, mainCcy() as any)}</span>
          </div>
        </div>

        <Button
          type="button"
          className="w-full bg-accent md:w-full"
          onClick={handleContinueToPayment}
          disabled={isButtonDisabled}
        >
          Continue to Payment
        </Button>
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