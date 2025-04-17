import { useState, useCallback, useEffect } from 'react';
import CallService from '../services/CallService';

const useCallState = (navigation) => {
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [caller, setCaller] = useState(null);
  const [callType, setCallType] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  useEffect(() => {
    const handleCallEvent = (event, data) => {
      switch (event) {
        case 'incoming-call':
          setIsIncomingCall(true);
          setCaller(data.caller);
          setCallType(data.callType);
          break;
        
        case 'call-accepted':
          setActiveCall({
            userId: data.userId,
            type: data.callType,
            startTime: new Date(),
          });
          navigation.navigate('Call', {
            userId: data.userId,
            contactName: data.caller.name,
            contactAvatar: data.caller.avatar,
            callType: data.callType,
          });
          break;
        
        case 'call-ended':
          setActiveCall(null);
          setIsIncomingCall(false);
          setCaller(null);
          setCallType(null);
          break;
      }
    };

    // Initialiser le service d'appel
    CallService.initialize("YOUR_SOCKET_URL", handleCallEvent);

    return () => {
      // Nettoyer le service d'appel
      CallService.cleanup();
    };
  }, [navigation]);

  const makeCall = useCallback(async (userId, type = 'audio') => {
    try {
      await CallService.startCall(userId, type === 'video');
      setActiveCall({
        userId,
        type,
        startTime: new Date(),
      });
      return true;
    } catch (error) {
      console.error("Erreur lors de l'appel:", error);
      return false;
    }
  }, []);

  const acceptCall = useCallback(async () => {
    try {
      await CallService.answerCall(caller.userId, callType === 'video');
      setIsIncomingCall(false);
      setActiveCall({
        userId: caller.userId,
        type: callType,
        startTime: new Date(),
      });
      navigation.navigate('Call', {
        userId: caller.userId,
        contactName: caller.name,
        contactAvatar: caller.avatar,
        callType,
      });
    } catch (error) {
      console.error("Erreur lors de l'acceptation de l'appel:", error);
    }
  }, [caller, callType, navigation]);

  const declineCall = useCallback(async () => {
    try {
      await CallService.endCall();
      setIsIncomingCall(false);
      setCaller(null);
      setCallType(null);
    } catch (error) {
      console.error("Erreur lors du refus de l'appel:", error);
    }
  }, []);

  const endCall = useCallback(async () => {
    try {
      await CallService.endCall();
      setActiveCall(null);
    } catch (error) {
      console.error("Erreur lors de la fin de l'appel:", error);
    }
  }, []);

  return {
    isIncomingCall,
    caller,
    callType,
    activeCall,
    makeCall,
    acceptCall,
    declineCall,
    endCall,
  };
};

export default useCallState;
