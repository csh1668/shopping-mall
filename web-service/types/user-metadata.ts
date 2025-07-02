import { UserMetadata as PrismaUserMetadata } from '@prisma/client'

// DB 모델 그대로 사용
export type UserMetadata = PrismaUserMetadata

// 클라이언트에서 사용할 타입 (DB 관련 필드 제외)
export type ClientUserMetadata = Omit<UserMetadata, 'createdAt' | 'updatedAt'>

// 사용자 메타데이터 업데이트 시 사용하는 타입
export type UpdateUserMetadataInput = Partial<Pick<UserMetadata, 'fullName' | 'phone'>>

// DB 사용자 메타데이터를 클라이언트용으로 변환
export function toClientUserMetadata(dbUserMetadata: UserMetadata): ClientUserMetadata {
  const { createdAt, updatedAt, ...clientUserMetadata } = dbUserMetadata
  return clientUserMetadata
} 