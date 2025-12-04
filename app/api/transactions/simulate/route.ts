import { auth } from '@/lib/auth';
import { paymentSimulatorSchema } from '@/lib/payment-simulator';
import prisma from '@/lib/prisma';
import { processSimulationRequest, type InsertTransactionInput } from '@/lib/transactions/simulator';
import { getUserPattern } from '@/lib/user-pattern';
import type { TransactionAction } from '@/types/transaction.types';
import { headers } from 'next/headers';
import { NextResponse } from "next/server";
import z from 'zod';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
        headers: await headers() // you need to pass the headers object.
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch (error) {
      return NextResponse.json({ error: 'InvalidJSON' }, { status: 400 })
    }

    const validation = paymentSimulatorSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: 'ValidationError', details: z.treeifyError(validation.error) }, { status: 400 })
    }

    const result = await processSimulationRequest(
      { input: validation.data, userId: session.user.id },
      {
        getUserPattern: (userId) => getUserPattern(userId),
        insertTransaction: (payload) => insertTransactionRecord(payload),
      },
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('[transactions.simulate] error', error)
    return NextResponse.json({ error: 'InternalServerError' }, { status: 500 })
  }
}

async function insertTransactionRecord(
  payload: InsertTransactionInput,
): Promise<{ id: string }> {
  const status = mapActionToStatus(payload.action)

  const transaction = await prisma.transaction.create({
    data: {
      user_id: payload.userId,
      amount: payload.amount,
      merchant_name: payload.merchant_name,
      merchant_category: payload.merchant_category,
      risk_score: payload.risk_score,
      risk_level: payload.risk_level,
      risk_reasons: payload.risk_reasons,
      status,
    },
    select: { id: true },
  })

  return { id: transaction.id }
}

function mapActionToStatus(action: TransactionAction) {
  if (action === 'voice_verification') {
    return 'pending_verification'
  }
  if (action === 'blocked') {
    return 'blocked'
  }
  return 'approved'
}
