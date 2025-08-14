import { useCallback, useMemo } from "react";
import type { CartItem } from "@/stores/cart-store";
import { useCartStore } from "@/stores/cart-store";

export function useCart() {
	const store = useCartStore();

	// Computed values
	const totalItems = useMemo(() => {
		return store.items.reduce((total, item) => total + item.quantity, 0);
	}, [store.items]);

	const totalPrice = useMemo(() => {
		return store.items.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);
	}, [store.items]);

	const originalTotalPrice = useMemo(() => {
		return store.items.reduce(
			(total, item) =>
				total + (item.originalPrice || item.price) * item.quantity,
			0,
		);
	}, [store.items]);

	const discountAmount = useMemo(() => {
		return originalTotalPrice - totalPrice;
	}, [originalTotalPrice, totalPrice]);

	const hasDiscount = useMemo(() => {
		return discountAmount > 0;
	}, [discountAmount]);

	const isEmpty = useMemo(() => {
		return store.items.length === 0;
	}, [store.items]);

	// Business logic actions
	const addItem = useCallback(
		(item: Omit<CartItem, "quantity">) => {
			store.addItem(item);
			// 아이템 추가 시 사이드바를 자동으로 열기
			if (!store.isOpen) {
				store.openCart();
			}
		},
		[store],
	);

	const removeItem = useCallback(
		(id: string) => {
			store.removeItem(id);
		},
		[store],
	);

	const updateQuantity = useCallback(
		(id: string, quantity: number) => {
			if (quantity <= 0) {
				removeItem(id);
				return;
			}
			store.updateQuantity(id, quantity);
		},
		[store, removeItem],
	);

	const increaseQuantity = useCallback(
		(id: string) => {
			const item = store.items.find((item) => item.id === id);
			if (item) {
				updateQuantity(id, item.quantity + 1);
			}
		},
		[store.items, updateQuantity],
	);

	const decreaseQuantity = useCallback(
		(id: string) => {
			const item = store.items.find((item) => item.id === id);
			if (item) {
				updateQuantity(id, item.quantity - 1);
			}
		},
		[store.items, updateQuantity],
	);

	const clearCart = useCallback(() => {
		store.clearCart();
	}, [store]);

	const openCart = useCallback(() => {
		store.openCart();
	}, [store]);

	const closeCart = useCallback(() => {
		store.closeCart();
	}, [store]);

	const toggleCart = useCallback(() => {
		store.toggleCart();
	}, [store]);

	// Utility functions
	const getItem = useCallback(
		(id: string) => {
			return store.items.find((item) => item.id === id);
		},
		[store.items],
	);

	const isItemInCart = useCallback(
		(id: string) => {
			return store.items.some((item) => item.id === id);
		},
		[store.items],
	);

	const getItemQuantity = useCallback(
		(id: string) => {
			const item = store.items.find((item) => item.id === id);
			return item?.quantity || 0;
		},
		[store.items],
	);

	return {
		// State
		items: store.items,
		isOpen: store.isOpen,

		// Computed values
		totalItems,
		totalPrice,
		originalTotalPrice,
		discountAmount,
		hasDiscount,
		isEmpty,

		// Actions
		addItem,
		removeItem,
		updateQuantity,
		increaseQuantity,
		decreaseQuantity,
		clearCart,
		openCart,
		closeCart,
		toggleCart,

		// Utilities
		getItem,
		isItemInCart,
		getItemQuantity,
	};
}
