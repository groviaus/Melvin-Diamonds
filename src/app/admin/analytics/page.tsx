import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  UsersIcon,
  PackageIcon,
} from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231",
      change: "+20.1%",
      trend: "up",
      icon: DollarSignIcon,
    },
    {
      title: "Total Orders",
      value: "2,847",
      change: "+180",
      trend: "up",
      icon: ShoppingCartIcon,
    },
    {
      title: "Total Customers",
      value: "1,234",
      change: "+89",
      trend: "up",
      icon: UsersIcon,
    },
    {
      title: "Total Products",
      value: "156",
      change: "+12",
      trend: "up",
      icon: PackageIcon,
    },
  ];

  const monthlyData = [
    { month: "Jan", revenue: 12000, orders: 240, customers: 180 },
    { month: "Feb", revenue: 19000, orders: 320, customers: 220 },
    { month: "Mar", revenue: 15000, orders: 280, customers: 200 },
    { month: "Apr", revenue: 22000, orders: 380, customers: 280 },
    { month: "May", revenue: 28000, orders: 420, customers: 320 },
    { month: "Jun", revenue: 32000, orders: 480, customers: 380 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          View detailed analytics and insights about your business
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
                )}
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data) => (
                <div
                  key={data.month}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      {data.orders} orders
                    </span>
                    <span className="text-sm font-medium">
                      ${data.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>
              Best selling products this quarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Classic Diamond Ring",
                  sales: 45,
                  revenue: "$112,500",
                },
                { name: "Emerald Cut Ring", sales: 32, revenue: "$80,000" },
                { name: "Princess Cut Ring", sales: 28, revenue: "$70,000" },
                { name: "Vintage Style Ring", sales: 25, revenue: "$62,500" },
                { name: "Modern Solitaire", sales: 22, revenue: "$55,000" },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">
                        {i + 1}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {product.sales} sales
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.revenue}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
