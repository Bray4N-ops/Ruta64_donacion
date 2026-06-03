import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const proyecto_id = parseInt(session.metadata!.proyecto_id);
    const monto = (session.amount_total || 0) / 100;
    // Insertar donación
    await supabase.from('donaciones').insert({
      proyecto_id,
      monto,
      stripe_payment_intent: session.payment_intent,
    });
    // Actualizar recaudado del proyecto (usando función SQL o RPC)
    await supabase.rpc('incrementar_recaudado', { pid: proyecto_id, monto });
  }
  return NextResponse.json({ received: true });
}