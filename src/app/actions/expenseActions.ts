'use server'

import { prisma } from "@/app/lib/prisma"

// 🟩 GET: Paginated expenses
export async function getPaginatedExpenses(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize

  const [expenses, totalCount] = await Promise.all([
    prisma.expense.findMany({
      skip,
      take: pageSize,
      orderBy: { date: 'desc' },
    }),
    prisma.expense.count(),
  ])

  return {
    expenses,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  }
}

// 🟦 POST: Create a new expense
export async function createExpense(data: {
  type: string
  amount: number
  comments?: string
  date: string
}) {
  const expense = await prisma.expense.create({
    data: {
      type: data.type,
      amount: data.amount,
      comments: data.comments,
      date: new Date(data.date),
    },
  })

  return expense
}

// 🟨 PATCH: Update an expense by ID
export async function updateExpense(expenseId: string, data: Partial<{
  type: string
  amount: number
  comments: string
  date: string
}>) {
  const updated = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      ...data,
      ...(data.date && { date: new Date(data.date) }),
    },
  })

  return updated
}

// 🟥 DELETE: Delete an expense by ID
export async function deleteExpense(expenseId: string) {
  const deleted = await prisma.expense.delete({
    where: { id: expenseId },
  })

  return deleted
}
