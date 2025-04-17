import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { authenticator } from "https://deno.land/x/otpauth@v9.1.3/mod.ts"

serve(async (req) => {
  try {
    // Créer un client Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Récupérer les données de la requête
    const { user_id, token, secret } = await req.json()

    // Vérifier que l'utilisateur vérifie son propre token
    if (user.id !== user_id) {
      return new Response(
        JSON.stringify({ error: 'Non autorisé' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Créer l'instance TOTP
    const totp = new authenticator.TOTP({
      secret: secret,
      algorithm: 'SHA1',
      digits: 6,
      period: 30
    })

    // Vérifier le token
    const delta = totp.validate({ token, window: 1 })
    const isValid = delta !== null

    return new Response(
      JSON.stringify({
        valid: isValid
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
