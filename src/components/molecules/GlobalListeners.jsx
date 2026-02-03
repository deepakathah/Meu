
import { useRequestPortal } from '@/context/RequestPortalContext2';
import Constants from 'expo-constants';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useSelector } from 'react-redux';

const GlobalListeners = () => {
  const { getSocketData, getSocket } = useRequestPortal();
  const { user_id } = useSelector((state) => state.auth);
  const { wsUrl } = Constants.expoConfig.extra;
  const wsRef = useRef(null);
  const lastRequestIdRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (!user_id) return;

    let pingInterval;

    const connectWebSocket = () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      const ws = new WebSocket(wsUrl);
      

      ws.onopen = () => {
        console.log('WebSocket connected');
        ws.send(JSON.stringify({ action: 'popUpDateRequest', userId: user_id }));
        getSocket(ws)
      };

      ws.onmessage = (event) => {
        try {
          if (typeof event.data !== 'string') {
            console.warn('Received non-string WebSocket message:', event.data);
            return;
          }

          const socketData = JSON.parse(event.data);
          if (!socketData) return;


          if (socketData._id && socketData._id === lastRequestIdRef.current) {
            console.log('Duplicate socketData ignored');
            return;
          }

          lastRequestIdRef.current = socketData._id;
          getSocketData(socketData);
        } catch (err) {
          console.log('WebSocket message parse error:', err);
        }
      };

      ws.onerror = (event) => {
        console.log('WebSocket error:', event);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        clearInterval(pingInterval);

        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      wsRef.current = ws;
    };

    connectWebSocket();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App resumed, checking WebSocket...');
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          wsRef.current?.close();
          connectWebSocket();
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (pingInterval) {
        clearInterval(pingInterval);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      subscription.remove();
    };
  }, [wsUrl, user_id, getSocketData]);

  return null;
};

export default GlobalListeners;

