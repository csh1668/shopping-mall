import { router } from './index'
import { exampleRouter } from './routers/example'

export const appRouter = router({
  example: exampleRouter,
  // 여기에 각 도메인별 라우터들을 추가할 예정
  // 예: user: userRouter,
  //     product: productRouter,
  //     order: orderRouter,
})

export type AppRouter = typeof appRouter 