import { useCallback, useState } from "react";

export default function useRequestPortalSocket() {
  const [portalSocket, setPortalSocket] = useState(null);
  const [socketData, setSocketData] = useState({});

  const getSocketData = useCallback((data) => {
    setSocketData(data);
  }, []);

  const getSocket = useCallback((socket) => {
    setPortalSocket(socket);
  }, []);

  const sendMessageToSocket = useCallback(
    (payload) => {
      portalSocket?.send(JSON.stringify(payload));
      console.log("Sent via socket:", JSON.stringify(payload));
    },
    [portalSocket]
  );

  return {
    portalSocket,
    setPortalSocket,
    socketData,
    setSocketData,
    getSocketData,
    getSocket,
    sendMessageToSocket,
  };
}
