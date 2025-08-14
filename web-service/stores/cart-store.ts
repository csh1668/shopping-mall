import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
	id: string;
	name: string;
	price: number;
	originalPrice?: number;
	image?: string;
	brand?: string;
	quantity: number;
	inStock: boolean;
}

interface CartStore {
	items: CartItem[];
	isOpen: boolean;

	// Basic actions - pure store operations only
	addItem: (item: Omit<CartItem, "quantity">) => void;
	removeItem: (id: string) => void;
	updateQuantity: (id: string, quantity: number) => void;
	clearCart: () => void;
	openCart: () => void;
	closeCart: () => void;
	toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			items: [],
			isOpen: false,

			addItem: (newItem) => {
				const items = get().items;
				const existingItem = items.find((item) => item.id === newItem.id);

				if (existingItem) {
					set({
						items: items.map((item) =>
							item.id === newItem.id
								? { ...item, quantity: item.quantity + 1 }
								: item,
						),
					});
				} else {
					set({
						items: [...items, { ...newItem, quantity: 1 }],
					});
				}
			},

			removeItem: (id) => {
				set({
					items: get().items.filter((item) => item.id !== id),
				});
			},

			updateQuantity: (id, quantity) => {
				set({
					items: get().items.map((item) =>
						item.id === id ? { ...item, quantity } : item,
					),
				});
			},

			clearCart: () => {
				set({ items: [] });
			},

			openCart: () => {
				set({ isOpen: true });
			},

			closeCart: () => {
				set({ isOpen: false });
			},

			toggleCart: () => {
				set({ isOpen: !get().isOpen });
			},
		}),
		{
			name: "cart-storage",
		},
	),
);
