'use client'

import { useState } from 'react'
import { useAuth, useUserMetadata, useUpdateUserMetadata } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function AuthExample() {
  const { user, isAuthenticated, loading, error, signIn, signUp, signOut } = useAuth()
  const { userMetadata, isLoading: metadataLoading } = useUserMetadata()
  const { updateUserMetadata, isLoading: updateLoading } = useUpdateUserMetadata()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn({ email, password })
    } catch (error) {
      console.error('로그인 실패:', error)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUp({ email, password, fullName, phone })
    } catch (error) {
      console.error('회원가입 실패:', error)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      await updateUserMetadata({
        fullName: fullName || undefined,
        phone: phone || undefined,
      })
    } catch (error) {
      console.error('프로필 업데이트 실패:', error)
    }
  }

  if (loading) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {!isAuthenticated ? (
        <Card>
          <CardHeader>
            <CardTitle>로그인 / 회원가입</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  로그인
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleSignUp}>
                  회원가입
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>사용자 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>이메일:</strong> {user?.email}</p>
                <p><strong>ID:</strong> {user?.id}</p>
                {metadataLoading ? (
                  <p>메타데이터 로딩 중...</p>
                ) : (
                  <>
                    <p><strong>이름:</strong> {userMetadata?.fullName || '미설정'}</p>
                    <p><strong>전화번호:</strong> {userMetadata?.phone || '미설정'}</p>
                    <p><strong>역할:</strong> {userMetadata?.role?.join(', ') || 'CUSTOMER'}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>프로필 업데이트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="이름"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                placeholder="전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button 
                onClick={handleUpdateProfile} 
                disabled={updateLoading}
                className="w-full"
              >
                {updateLoading ? '업데이트 중...' : '프로필 업데이트'}
              </Button>
            </CardContent>
          </Card>

          <Button onClick={signOut} variant="destructive" className="w-full">
            로그아웃
          </Button>
        </div>
      )}
    </div>
  )
} 