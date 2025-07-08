import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { protectedProcedure, router } from "@/server";
import {
	updateUserMetadataResponseSchema,
	updateUserMetadataSchema,
} from "@/server/schemas";

export const userRouter = router({
	getUserMetadata: protectedProcedure.query(async ({ ctx }) => {
		const user = ctx.user;

		const metadata = await prisma.userMetadata.findUnique({
			where: {
				id: user.id,
			},
			select: {
				id: true,
				fullName: true,
				phone: true,
				role: true,
			},
		});

		return metadata;
	}),

	updateUserMetadata: protectedProcedure
		.input(updateUserMetadataSchema)
		.mutation(async ({ ctx, input }) => {
			const user = ctx.user;

			// 업데이트할 데이터 준비
			const updateData: Prisma.UserMetadataUpdateInput = {};
			if (input.fullName !== undefined) updateData.fullName = input.fullName;
			if (input.phone !== undefined) updateData.phone = input.phone;

			try {
				const updatedMetadata = await prisma.userMetadata.update({
					where: {
						id: user.id,
					},
					data: updateData,
					select: {
						id: true,
						fullName: true,
						phone: true,
						role: true,
					},
				});

				const response = {
					success: true,
					message: "사용자 정보가 성공적으로 업데이트되었습니다.",
					data: updatedMetadata,
				};

				// 응답 스키마로 검증
				return updateUserMetadataResponseSchema.parse(response);
			} catch (error) {
				// Prisma 에러 처리
				if (error instanceof Error) {
					if (error.message.includes("Record to update not found")) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "사용자 정보를 찾을 수 없습니다.",
						});
					}
				}

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "사용자 정보 업데이트에 실패했습니다.",
				});
			}
		}),
});
