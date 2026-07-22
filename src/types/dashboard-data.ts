export interface DashboardData {
  metrics: {
    totalRevenue: number;
    activeOrdersCount: number;
    totalCustomers: number;
    lowStockCount: number;
  };
  revenueByDay: { _id: string; revenue: number; orders: number }[];
  topProducts: { name: string; totalSold: number; revenue: number }[];
  ordersByStatus: { _id: string; count: number }[];
  lowStockProducts: { name: string; variants: unknown[] }[];
}
