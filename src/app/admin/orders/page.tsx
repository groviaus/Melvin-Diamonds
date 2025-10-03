"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PackageIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

interface OrderItem {
  productId: string;
  productName: string;
  productDescription: string | null;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  razorpayOrderId: string | null;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  customerPhone: string | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case "processing":
        return <PackageIcon className="w-4 h-4 text-blue-500" />;
      case "shipped":
        return <TruckIcon className="w-4 h-4 text-purple-500" />;
      case "delivered":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "cancelled":
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { variant: "default" | "secondary" | "destructive"; className?: string }
    > = {
      pending: { variant: "secondary" },
      processing: { variant: "default" },
      shipped: { variant: "default", className: "bg-purple-600" },
      delivered: { variant: "default", className: "bg-green-600" },
      cancelled: { variant: "destructive" },
    };

    const config = statusMap[status] || { variant: "secondary" };
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    return paymentStatus === "paid" ? (
      <Badge variant="default" className="bg-green-600">
        Paid
      </Badge>
    ) : (
      <Badge variant="secondary">
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-24 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-4 bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-4 h-4 rounded" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Skeleton className="h-5 w-20 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          {orders.length} orders • Manage and track their status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            Complete order history from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders yet
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrders.has(order.id);
                return (
                  <div
                    key={order.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 bg-gray-50">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="font-medium">
                            Order #{order.id.slice(0, 8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.userName} • {order.userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(order.total)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(order.status)}
                          {getPaymentBadge(order.paymentStatus)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderExpansion(order.id)}
                        >
                          {isExpanded ? (
                            <ChevronUpIcon className="w-4 h-4" />
                          ) : (
                            <ChevronDownIcon className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          {/* Shipping Details */}
                          <div className="md:col-span-1 space-y-2">
                            <h4 className="font-medium text-gray-800">
                              Shipping Address
                            </h4>
                            <div className="text-muted-foreground">
                              <p>{order.shippingAddress.address}</p>
                              <p>
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}{" "}
                                {order.shippingAddress.zipCode}
                              </p>
                              <p>{order.shippingAddress.country}</p>
                              {order.customerPhone && (
                                <p>Phone: {order.customerPhone}</p>
                              )}
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div className="md:col-span-1 space-y-2">
                            <h4 className="font-medium text-gray-800">
                              Payment Details
                            </h4>
                            <p>
                              <span className="text-muted-foreground">
                                Method:{" "}
                              </span>
                              <span className="font-medium">
                                {order.paymentMethod}
                              </span>
                            </p>
                            {order.razorpayOrderId && (
                              <p>
                                <span className="text-muted-foreground">
                                  Razorpay ID:{" "}
                                </span>
                                <span className="font-medium font-mono text-xs">
                                  {order.razorpayOrderId}
                                </span>
                              </p>
                            )}
                          </div>

                          {/* Order Meta */}
                          <div className="md:col-span-1 space-y-2">
                            <h4 className="font-medium text-gray-800">
                              Order Info
                            </h4>
                            <p>
                              <span className="text-muted-foreground">
                                Items:{" "}
                              </span>
                              <span className="font-medium">
                                {order.itemCount}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Last Updated:{" "}
                              </span>
                              <span className="font-medium">
                                {new Date(order.updatedAt).toLocaleString()}
                              </span>
                            </p>
                          </div>
                        </div>

                        {order.items.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2">Order Items:</h4>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-start p-3 bg-gray-50 rounded"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {item.productName}
                                    </p>
                                    {item.productDescription && (
                                      <p className="text-sm text-muted-foreground">
                                        {item.productDescription}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {formatCurrency(item.price)} ×{" "}
                                      {item.quantity}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Total:{" "}
                                      {formatCurrency(
                                        item.price * item.quantity
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
