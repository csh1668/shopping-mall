import { z } from "zod";

export * from "./user";

export const commonSchemas = {
	// ID 검증
	id: z.object({
		id: z.string().min(1, "ID는 필수입니다."),
	}),

	// UUID 검증
	uuid: z.object({
		id: z.string().uuid("올바른 UUID 형식이 아닙니다."),
	}),

	// 페이지네이션
	pagination: z.object({
		page: z.number().min(1).default(1),
		limit: z.number().min(1).max(100).default(20),
	}),

	// 문자열 검색
	search: z.object({
		search: z.string().optional(),
	}),
};
