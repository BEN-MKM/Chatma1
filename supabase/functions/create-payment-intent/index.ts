import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'npm:stripe@12.0.0';
import { createClient } from '@supabase/supabase-js';

interface PaymentIntentRequest {
  amount: number;
  currency: string;
}

interface PaymentIntentResponse {
  clientSecret: string;
}

interface ErrorResponse {
  error: string;
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, currency }: PaymentIntentRequest = await req.json()

    // Créer un client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Vérifier l'authentification
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      throw new Error('Non autorisé')
    }

    // Créer un payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir en centimes
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Enregistrer la transaction dans la base de données
    const { error: dbError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        amount,
        currency,
        status: 'pending',
        payment_intent_id: paymentIntent.id,
      })

    if (dbError) {
      console.error('Erreur lors de l\'enregistrement de la transaction:', dbError)
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
