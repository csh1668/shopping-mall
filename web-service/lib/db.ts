import { prisma } from "./prisma"
import type { User, Address, Product, Review } from "@prisma/client"

// User Service
export const userService = {
  async create(data: { id: string; email: string; fullName: string; phone?: string }) {
    return prisma.user.create({ data })
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            items: true,
            address: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },

  async update(id: string, data: Partial<User>) {
    return prisma.user.update({ where: { id }, data })
  },
}

// Address Service
export const addressService = {
  async create(data: {
    userId: string
    name: string
    phone: string
    address: string
    detailAddress?: string
    zipCode: string
    isDefault?: boolean
  }) {
    // If this is the default address, unset other defaults
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: data.userId },
        data: { isDefault: false },
      })
    }

    return prisma.address.create({ data })
  },

  async findByUserId(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    })
  },

  async update(id: string, data: Partial<Address>) {
    return prisma.address.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.address.delete({ where: { id } })
  },

  async setDefault(id: string, userId: string) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    })

    return prisma.address.update({
      where: { id },
      data: { isDefault: true },
    })
  },
}

// Order Service
export const orderService = {
  async create(data: {
    userId: string
    addressId: string
    totalAmount: number
    shippingFee?: number
    paymentMethod: string
    items: Array<{
      name: string
      price: number
      quantity: number
      image?: string
    }>
  }) {
    return prisma.order.create({
      data: {
        userId: data.userId,
        addressId: data.addressId,
        totalAmount: data.totalAmount,
        shippingFee: data.shippingFee || 0,
        paymentMethod: data.paymentMethod,
        items: {
          create: data.items,
        },
      },
      include: {
        items: true,
        address: true,
      },
    })
  },

  async findByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
        address: true,
      },
      orderBy: { createdAt: "desc" },
    })
  },

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        user: true,
      },
    })
  },

  async updateStatus(id: string, status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED") {
    return prisma.order.update({
      where: { id },
      data: { status },
    })
  },
}

// Product Service
export const productService = {
  async create(data: {
    name: string
    description: string
    price: number
    category: string
    brand: string
    image: string
    stock?: number
  }) {
    return prisma.product.create({ data })
  },

  async findMany(filters?: {
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    search?: string
  }) {
    const where: any = {}

    if (filters?.category) where.category = filters.category
    if (filters?.brand) where.brand = filters.brand
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {}
      if (filters.minPrice) where.price.gte = filters.minPrice
      if (filters.maxPrice) where.price.lte = filters.maxPrice
    }
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { brand: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    return prisma.product.findMany({
      where,
      include: {
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  },

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    })
  },

  async update(id: string, data: Partial<Product>) {
    return prisma.product.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.product.delete({ where: { id } })
  },
}

// Review Service
export const reviewService = {
  async create(data: {
    userId: string
    productId: string
    rating: number
    content: string
  }) {
    return prisma.review.create({
      data,
      include: { user: true },
    })
  },

  async findByProductId(productId: string) {
    return prisma.review.findMany({
      where: { productId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    })
  },

  async update(id: string, data: Partial<Review>) {
    return prisma.review.update({ where: { id }, data })
  },

  async delete(id: string) {
    return prisma.review.delete({ where: { id } })
  },
}
