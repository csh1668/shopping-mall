"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, User, Mail, Phone, Camera, Save, Package, Heart, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/lib/stores/auth-store"

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuthStore()
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
      })
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error } = await updateProfile(formData)

    if (error) {
      setMessage("프로필 업데이트에 실패했습니다.")
    } else {
      setMessage("프로필이 성공적으로 업데이트되었습니다.")
    }

    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (!user || !profile) {
    return null
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">프로필</h1>
              <p className="text-muted-foreground">개인정보를 관리하세요</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>기본 정보</CardTitle>
                  <CardDescription>프로필 정보를 수정할 수 있습니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                      <Alert>
                        <AlertDescription>{message}</AlertDescription>
                      </Alert>
                    )}

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
                        <AvatarFallback className="text-lg">
                          {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size="sm" disabled>
                          <Camera className="h-4 w-4 mr-2" />
                          사진 변경
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">JPG, PNG 파일만 업로드 가능합니다</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="full_name">이름</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="full_name"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="이름을 입력하세요"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input id="email" value={profile.email} className="pl-10" disabled />
                        </div>
                        <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">전화번호</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="010-1234-5678"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>가입일</Label>
                        <Input value={new Date(profile.created_at).toLocaleDateString("ko-KR")} disabled />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? "저장 중..." : "변경사항 저장"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Password Change */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>비밀번호 변경</CardTitle>
                  <CardDescription>보안을 위해 정기적으로 비밀번호를 변경하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" disabled>
                    비밀번호 변경
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">비밀번호 변경 기능은 곧 제공될 예정입니다</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>빠른 메뉴</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/orders">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Package className="h-4 w-4 mr-2" />
                      주문 내역
                    </Button>
                  </Link>
                  <Link href="/wishlist">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Heart className="h-4 w-4 mr-2" />
                      찜한 상품
                    </Button>
                  </Link>
                  <Link href="/addresses">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MapPin className="h-4 w-4 mr-2" />
                      배송지 관리
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>계정 통계</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 주문 수</span>
                    <span className="font-medium">0건</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">총 구매 금액</span>
                    <span className="font-medium">0원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">적립금</span>
                    <span className="font-medium">0원</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">쿠폰</span>
                    <span className="font-medium">0장</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
