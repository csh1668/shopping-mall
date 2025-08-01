import { router } from "./index";
import { categoryRouter } from "./routers/category";
import { exampleRouter } from "./routers/example";
import { orderRouter } from "./routers/order";
import { paymentRouter } from "./routers/payment";
import { productRouter } from "./routers/product";
import { userRouter } from "./routers/user";

export const appRouter = router({
	example: exampleRouter,
	user: userRouter,
	product: productRouter,
	category: categoryRouter,
	payment: paymentRouter,
	order: orderRouter,
	// 여기에 각 도메인별 라우터들을 추가할 예정
	// 예: cart: cartRouter,
});

export type AppRouter = typeof appRouter;
