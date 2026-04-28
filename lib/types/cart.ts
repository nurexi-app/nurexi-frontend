export interface CartItem {
  id: string;
  type: "bundle" | "course";
  name: string;
  price: number;
  quantity: number;
  sessionCount?: number;
  image?: string;
}
