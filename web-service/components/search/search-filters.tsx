'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  className?: string
}

export interface FilterState {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  rating: number
  inStock: boolean
  onSale: boolean
}

const categories: FilterOption[] = [
  { id: '1', label: '전자기기', value: 'electronics', count: 156 },
  { id: '2', label: '의류', value: 'clothing', count: 89 },
  { id: '3', label: '가전제품', value: 'appliances', count: 67 },
  { id: '4', label: '스포츠용품', value: 'sports', count: 45 },
  { id: '5', label: '도서', value: 'books', count: 123 },
]

const brands: FilterOption[] = [
  { id: '1', label: 'TechPro', value: 'techpro', count: 34 },
  { id: '2', label: 'SmartTech', value: 'smarttech', count: 28 },
  { id: '3', label: 'SoundMax', value: 'soundmax', count: 15 },
  { id: '4', label: 'FashionCo', value: 'fashionco', count: 42 },
  { id: '5', label: 'SportGear', value: 'sportgear', count: 23 },
]

export function SearchFilters({ onFiltersChange, className = "" }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 1000000],
    rating: 0,
    inStock: false,
    onSale: false,
  })

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      categories: [],
      brands: [],
      priceRange: [0, 1000000],
      rating: 0,
      inStock: false,
      onSale: false,
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = 
    filters.categories.length + 
    filters.brands.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.inStock ? 1 : 0) + 
    (filters.onSale ? 1 : 0)

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              필터
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>검색 필터</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              {/* 카테고리 */}
              <div>
                <Label className="text-base font-medium">카테고리</Label>
                <div className="space-y-2 mt-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({
                              categories: [...filters.categories, category.value]
                            })
                          } else {
                            updateFilters({
                              categories: filters.categories.filter(c => c !== category.value)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={category.id} className="flex-1">
                        {category.label}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 브랜드 */}
              <div>
                <Label className="text-base font-medium">브랜드</Label>
                <div className="space-y-2 mt-2">
                  {brands.map((brand) => (
                    <div key={brand.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand.id}
                        checked={filters.brands.includes(brand.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilters({
                              brands: [...filters.brands, brand.value]
                            })
                          } else {
                            updateFilters({
                              brands: filters.brands.filter(b => b !== brand.value)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={brand.id} className="flex-1">
                        {brand.label}
                      </Label>
                      <Badge variant="outline" className="text-xs">
                        {brand.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 가격 범위 */}
              <div>
                <Label className="text-base font-medium">가격 범위</Label>
                <div className="mt-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                    max={1000000}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>₩{filters.priceRange[0].toLocaleString()}</span>
                    <span>₩{filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 기타 필터 */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => updateFilters({ inStock: !!checked })}
                  />
                  <Label htmlFor="inStock">재고 있음</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onSale"
                    checked={filters.onSale}
                    onCheckedChange={(checked) => updateFilters({ onSale: !!checked })}
                  />
                  <Label htmlFor="onSale">할인 상품</Label>
                </div>
              </div>

              <Separator />

              {/* 필터 초기화 */}
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                필터 초기화
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            초기화
          </Button>
        )}
      </div>
    </div>
  )
} 