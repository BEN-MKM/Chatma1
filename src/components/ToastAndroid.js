import { Platform, ToastAndroid } from 'react-native';

// Créer un composant Toast personnalisé qui fonctionne sur Android et iOS
const Toast = {
  show: (message, duration = ToastAndroid.SHORT) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, duration);
    } else {
      // Sur iOS, on pourrait implémenter une autre solution
      console.log(message);
    }
  }
};

export default Toast;
