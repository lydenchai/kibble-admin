export interface DashboardData {
  metrics: {
    total_revenue: number;
    active_orders_count: number;
    total_customers: number;
    low_stock_count: number;
  };
  revenue_by_day: { _id: string; revenue: number; orders: number }[];
  top_products: { name: string; totalSold: number; revenue: number }[];
  orders_by_status: { _id: string; count: number }[];
  low_stock_products: { name: string; variants: unknown[] }[];
}
