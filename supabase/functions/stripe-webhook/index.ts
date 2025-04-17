import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2022-11-15',
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature || !endpointSecret) {
      throw new Error('Signature ou secret manquant')
    }

    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)

    // Créer un client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object
        const { metadata } = paymentIntent

        // Mettre à jour le statut de la transaction
        await supabaseClient
          .from('transactions')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', paymentIntent.id)

        // Créer une notification pour l'utilisateur
        await supabaseClient
          .from('notifications')
          .insert({
            user_id: metadata.userId,
            type: 'payment',
            title: 'Paiement réussi',
            body: `Votre paiement de ${paymentIntent.amount / 100} ${paymentIntent.currency.toUpperCase()} a été traité avec succès.`,
            data: {
              amount: paymentIntent.amount / 100,
              currency: paymentIntent.currency,
            },
          })
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object
        const { metadata } = paymentIntent

        // Mettre à jour le statut de la transaction
        await supabaseClient
          .from('transactions')
          .update({
            status: 'failed',
            error_message: paymentIntent.last_payment_error?.message,
          })
          .eq('payment_intent_id', paymentIntent.id)

        // Créer une notification pour l'utilisateur
        await supabaseClient
          .from('notifications')
          .insert({
            user_id: metadata.userId,
            type: 'payment',
            title: 'Échec du paiement',
            body: 'Une erreur est survenue lors du traitement de votre paiement.',
            data: {
              error: paymentIntent.last_payment_error?.message,
            },
          })
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const { metadata } = subscription

        // Mettre à jour l'abonnement dans la base de données
        await supabaseClient
          .from('subscriptions')
          .upsert({
            id: subscription.id,
            user_id: metadata.userId,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        // Marquer l'abonnement comme supprimé
        await supabaseClient
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('id', subscription.id)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Erreur webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
