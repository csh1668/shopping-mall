import { router } from "./index";
import { exampleRouter } from "./routers/example";
import { userRouter } from "./routers/user";

export const appRouter = router({
	example: exampleRouter,
	user: userRouter,
	// 여기에 각 도메인별 라우터들을 추가할 예정
	// 예: product: productRouter,
	//     order: orderRouter,
});

export type AppRouter = typeof appRouter;
