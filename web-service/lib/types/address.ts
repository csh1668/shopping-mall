import { Address as PrismaAddress } from "@prisma/client";

// DB 모델
export type Address = PrismaAddress;

// 클라이언트 모델
export type ClientAddress = Omit<Address, "userId" | "createdAt" | "updatedAt">;

// 클라이언트 모델 생성 타입
export type CreateAddressInput = Omit<Address, "id" | "userId" | "createdAt" | "updatedAt">;

// 주소 업데이트 시 사용하는 타입
export type UpdateAddressInput = Partial<CreateAddressInput> & { id: string };

// 주소 검증 함수
export function validateAddress(address: Partial<CreateAddressInput>): string[] {
  const errors: string[] = [];
  
  if (!address.name?.trim()) errors.push("이름을 입력해주세요");
  if (!address.phone?.trim()) errors.push("전화번호를 입력해주세요");
  if (!address.address?.trim()) errors.push("주소를 입력해주세요");
  if (!address.zipCode?.trim()) errors.push("우편번호를 입력해주세요");
  
  // 전화번호 형식 검증
  const phoneRegex = /^[0-9-]+$/;
  if (address.phone && !phoneRegex.test(address.phone)) {
    errors.push("올바른 전화번호 형식을 입력해주세요");
  }
  
  return errors;
}

// 클라이언트 주소를 DB 주소로 변환
export function toDbAddress(clientAddress: CreateAddressInput, userId: string): Omit<Address, "id" | "createdAt" | "updatedAt"> {
  return {
    ...clientAddress,
    userId,
  };
}

// DB 주소를 클라이언트 주소로 변환
export function toClientAddress(dbAddress: Address): ClientAddress {
  const { userId, createdAt, updatedAt, ...clientAddress } = dbAddress;
  return clientAddress;
}