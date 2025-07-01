import { Address as PrismaAddress } from "@prisma/client";

// DB 모델
export type Address = PrismaAddress;

// 클라이언트 모델
export type AddressClient = Omit<Address, "userId" | "createdAt" | "updatedAt">;

// 클라이언트 모델 생성 타입
export type AddressCreate = Omit<AddressClient, "id" | "isDefault">;