import { paymentSimulatorSchema } from '@/lib/payment-simulator';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { processSimulationRequest, type InsertTransactionInput } from '@/lib/transactions/simulator';
import { getUserPattern } from '@/lib/user-pattern';
import type { Database } from '@/types/database.types';
import type { TransactionAction } from '@/types/transaction.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
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
      return NextResponse.json({ error: 'ValidationError', details: validation.error.flatten() }, { status: 400 })
    }

    const result = await processSimulationRequest(
      { input: validation.data, userId: user.id },
      {
        getUserPattern: (userId) => getUserPattern(userId, { client: supabase }),
        insertTransaction: (payload) => insertTransactionRecord(supabase, payload),
      },
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('[transactions.simulate] error', error)
    return NextResponse.json({ error: 'InternalServerError' }, { status: 500 })
  }
}

async function insertTransactionRecord(
  supabase: SupabaseClient<Database>,
  payload: InsertTransactionInput,
): Promise<{ id: string }> {
  const status = mapActionToStatus(payload.action)

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: payload.userId,
      amount: payload.amount,
      merchant_name: payload.merchant_name,
      merchant_category: payload.merchant_category,
      risk_score: payload.risk_score,
      risk_level: payload.risk_level,
      risk_reasons: payload.risk_reasons,
      status,
    })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to insert transaction')
  }

  return { id: data.id }
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
