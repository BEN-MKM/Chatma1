import { Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import supabase from '../config/supabase';

class PaymentService {
  constructor() {
    this.stripe = null;
  }

  setStripe(stripeInstance) {
    this.stripe = stripeInstance;
  }
  async getUserPaymentMethods(userId) {
    try {
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des méthodes de paiement:', error);
      throw error;
    }
  }

  async addPaymentMethod(userId, paymentMethodId) {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          payment_method_id: paymentMethodId,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la méthode de paiement:', error);
      throw error;
    }
  }
  async removePaymentMethod(methodId) {
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('payment_method_id', methodId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la méthode de paiement:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount, currency = 'eur') {
    try {
      const { data, error } = await supabase
        .functions.invoke('create-payment-intent', {
          body: { amount, currency }
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du payment intent:', error);
      throw error;
    }
  }

  async processPayment(amount, currency = 'eur') {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      // Create payment intent
      const { clientSecret } = await this.createPaymentIntent(amount, currency);

      // Initialize payment sheet
      const { error: initError } = await this.stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'ChatMa',
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return false;
      }

      // Present payment sheet
      const { error: paymentError } = await this.stripe.presentPaymentSheet();

      if (paymentError) {
        Alert.alert('Error', paymentError.message);
        return false;
      }

      Alert.alert('Success', 'Your payment was processed successfully');
      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      Alert.alert('Error', 'An error occurred while processing your payment');
      return false;
    }
  }

  async createSubscription(priceId) {
    try {
      const { data, error } = await supabase
        .functions.invoke('create-subscription', {
          body: { priceId }
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const { error } = await supabase
        .functions.invoke('cancel-subscription', {
          body: { subscriptionId }
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    }
  }
}

export default new PaymentService();
