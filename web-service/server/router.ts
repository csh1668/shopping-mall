import { router } from "./index";
import { exampleRouter } from "./routers/example";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { categoryRouter } from "./routers/category";

export const appRouter = router({
	example: exampleRouter,
	user: userRouter,
	product: productRouter,
	category: categoryRouter,
	// 여기에 각 도메인별 라우터들을 추가할 예정
	// 예: order: orderRouter,
	//     cart: cartRouter,
});

export type AppRouter = typeof appRouter;
