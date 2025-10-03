"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Truck,
  Shield,
  Lock,
  ChevronLeft,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/utils";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.subtotal());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter(); // Initialize router

  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Billing info state removed - not currently used
  // const [billingInfo, setBillingInfo] = useState({
  //   sameAsShipping: true,
  //   firstName: "",
  //   lastName: "",
  //   address: "",
  //   apartment: "",
  //   city: "",
  //   state: "",
  //   zipCode: "",
  // });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const disabled = items.length === 0;
  const shippingCost = subtotal > 100 ? 0 : 9.99; // Renamed for clarity
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  // Helper function to ensure price is a number
  const formatPrice = (price: number | string): string => {
    const numPrice =
      typeof price === "string" ? parseFloat(price) : Number(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsProcessing(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingInfo,
          items,
          subtotal,
          shippingCost,
          tax,
          total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to place order.");
      }

      // Clear cart and redirect to a success page
      clear();
      // For now, an alert and redirect to home. A dedicated success page is better.
      alert(`Order placed successfully! Order Number: ${result.orderNumber}`);
      router.push("/"); // Redirect to homepage
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (disabled) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground">
              Add some items to your cart before checking out.
            </p>
            <Button asChild>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10"
                asChild
              >
                <Link href="/cart">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">
                Checkout
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Secure checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid gap-6 lg:gap-8 xl:grid-cols-2">
          {/* Checkout Form */}
          <div className="space-y-6 sm:space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
                      1
                    </span>
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
                      2
                    </span>
                    <span>Shipping Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apartment">
                      Apartment, suite, etc. (optional)
                    </Label>
                    <Input
                      id="apartment"
                      value={shippingInfo.apartment}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          apartment: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="sm:col-span-2 lg:col-span-1 space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({
                            ...prev,
                            state: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP code</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) =>
                          setShippingInfo((prev) => ({
                            ...prev,
                            zipCode: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
                      3
                    </span>
                    <span>Payment Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentInfo.cardNumber}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentInfo.expiryDate}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            expiryDate: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentInfo.cvv}
                        onChange={(e) =>
                          setPaymentInfo((prev) => ({
                            ...prev,
                            cvv: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on card</Label>
                    <Input
                      id="nameOnCard"
                      value={paymentInfo.nameOnCard}
                      onChange={(e) =>
                        setPaymentInfo((prev) => ({
                          ...prev,
                          nameOnCard: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    <span>
                      Your payment information is secure and encrypted
                    </span>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="sticky top-20 lg:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3 sm:space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size || "no-size"}`}
                      className="flex items-start space-x-3 sm:space-x-4"
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                        {item.image && (
                          <Image
                            src={resolveMediaUrl(item.image)}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs sm:text-sm font-medium line-clamp-2">
                          {item.title}
                        </h4>
                        {item.size && (
                          <p className="text-xs text-muted-foreground">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-xs sm:text-sm font-medium">
                          ${formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.size
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.size
                            )
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 sm:h-8 sm:w-8 text-destructive"
                          onClick={() => removeItem(item.productId, item.size)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0
                        ? "Free"
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base sm:text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <span className="truncate">
                      Place Order - ${total.toFixed(2)}
                    </span>
                  )}
                </Button>

                {/* Security Badges */}
                <div className="flex items-center justify-center space-x-3 sm:space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3" />
                    <span className="hidden sm:inline">SSL Secured</span>
                    <span className="sm:hidden">SSL</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lock className="h-3 w-3" />
                    <span className="hidden sm:inline">256-bit Encryption</span>
                    <span className="sm:hidden">Encrypted</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Return Policy */}
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="text-xs sm:text-sm space-y-2 sm:space-y-3">
                  <h4 className="font-medium text-sm sm:text-base">
                    Return Policy
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    We offer a 30-day return policy for all items. Items must be
                    in original condition with tags attached.
                  </p>
                  <h4 className="font-medium text-sm sm:text-base">Shipping</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Free shipping on orders over $100. Standard shipping takes
                    3-5 business days.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
