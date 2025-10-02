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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  SearchIcon,
  UserIcon,
  MailIcon,
  MapPinIcon,
  ShoppingBagIcon,
} from "lucide-react";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  image: string | null;
  provider: string;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
  addresses: Address[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (data.success) {
        setCustomers(data.users);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
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

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-32 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-4 w-16" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            {customers.length} registered customers
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search customers by name or email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>
            All registered customers with their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? "No customers found" : "No customers yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="p-4 border rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {customer.image ? (
                          <img
                            src={customer.image}
                            alt={customer.name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <UserIcon className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{customer.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {customer.provider}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <MailIcon className="w-4 h-4 mr-1" />
                            {customer.email}
                          </span>
                          <span className="flex items-center">
                            <ShoppingBagIcon className="w-4 h-4 mr-1" />
                            {customer.orderCount} orders
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total spent
                      </p>
                    </div>
                  </div>

                  {customer.addresses.length > 0 && (
                    <div className="pl-14 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Saved Addresses:
                      </p>
                      {customer.addresses.map((address) => (
                        <div
                          key={address.id}
                          className="text-sm bg-gray-50 p-3 rounded flex items-start gap-2"
                        >
                          <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {address.fullName}
                              </span>
                              {address.isDefault && (
                                <Badge variant="default" className="text-xs">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground">
                              {address.addressLine1}
                              {address.addressLine2 &&
                                `, ${address.addressLine2}`}
                            </p>
                            <p className="text-muted-foreground">
                              {address.city}, {address.state}{" "}
                              {address.postalCode}
                            </p>
                            <p className="text-muted-foreground">
                              Phone: {address.phone}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
