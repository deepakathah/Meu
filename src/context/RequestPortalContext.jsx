import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";

import useDateTimer from "@/hooks/portal-modals/useDateTimer";
import useFeedback from "@/hooks/portal-modals/useFeedback";
import useRequestPortalSocket from "@/hooks/portal-modals/useRequestPortalSocket";

import CancelDateModal from "@/modals/portal-modals/CancelDateModal";
import CommonPopupModal from "@/modals/portal-modals/CommonPopupModal";
import ConfirmCheckInModal from "@/modals/portal-modals/ConfirmCheckInModal";
import DateCanceledModal from "@/modals/portal-modals/DateCanceledModal";
import DateRequestModal from "@/modals/portal-modals/DateRequestModal";
import DateStartedModal from "@/modals/portal-modals/DateStartedModal";
import FeedbackModal from "@/modals/portal-modals/FeedbackModal";
import HeadsUpModal from "@/modals/portal-modals/HeadsUpModal";
import ScannerModal from "@/modals/portal-modals/ScannerModal";

const RequestPortalContext = createContext();

export function RequestPortalProvider({ children }) {
  const { user_id, user, token } = useSelector((state) => state.auth);

  const [apiStartTime, setApiStartTime] = useState(null);
  const [portalData, setPortalData] = useState(null);

  const [isOpenCamera, setIsOpenCamera] = useState(false);
  const [isHeadsUp, setIsHeadsUp] = useState(false);
  const [headsUpData, setHeadsUpData] = useState(null);
  const [isEndDate, setIsEndDate] = useState(false);
  const [cancelDate, setCancelDate] = useState(false);
  const [canceledDate, setCanceledDate] = useState(false);
  const [confirmCheckIn, setConfirmCheckIn] = useState(false);
  const [commonPopVisible, setCommonPopVisible] = useState(false);

  const [isDisabled, setIsDisabled] = useState(false);

  const {
    portalSocket,
    socketData,
    getSocketData,
    getSocket,
    sendMessageToSocket,
  } = useRequestPortalSocket();

  const timer = useDateTimer(isEndDate, apiStartTime);

  const { feedbackModal, setFeedbackModal, feedbacks, setFeedbacks, handleFeedback } =
    useFeedback(token, socketData);

  const hidePortal = useCallback(() => setPortalData(null), []);

  useEffect(() => {
    if (!socketData?.action) return;
    console.log("Getting through :: ", socketData);

    switch (socketData.action) {
      case "updateRequestStatus":
        setPortalData(socketData.data);
        break;

      case "startDate":
        setPortalData(null);
        setIsHeadsUp(true);
        setHeadsUpData(socketData);
        break;

      case "endDate":
        setIsHeadsUp(false);
        setIsDisabled(false);
        setIsEndDate(true);
        setApiStartTime(socketData?.data["startTime"]);
        break;

      case "CompleteDate":
        setIsEndDate(false);
        setFeedbackModal(true);
        break;

      case "cancelDate":
        setCancelDate(true);
        break;

      case "dateCanceled":
        setIsHeadsUp(false);
        setIsDisabled(false);
        setCancelDate(false);
        setCanceledDate(true);
        break;

      case "confirmCheckIn":
        setConfirmCheckIn(true);
        break;

      case "popupShow":
        setCommonPopVisible(true);
        break;
    }
  }, [socketData, setFeedbackModal]);

  const sendRequestStatus = useCallback(
    (status) => {
      if (!portalSocket || !portalData?._id || !user_id) return;

      const payload = {
        action: socketData.action,
        userId: user_id,
        requestId: portalData._id,
        status,
      };

      try {
        portalSocket.send(JSON.stringify(payload));
        if (status === "rejected") Alert.alert(`Request ${status}`);
        hidePortal();
      } catch (err) {
        console.error("WebSocket send error:", err);
      }
    },
    [portalSocket, portalData, socketData, user_id, hidePortal]
  );

  const rejectRequest = () => sendRequestStatus("rejected");
  const acceptRequest = () => sendRequestStatus("accepted");

  const endDateFn = useCallback(
    (type) => {
      sendMessageToSocket({ ...socketData, userMessage: type });
    },
    [socketData, sendMessageToSocket]
  );

  const handleCancelRequest = useCallback(
    (request) => {
      const payload = { ...socketData, userId: user_id, status: request };
      portalSocket.send(JSON.stringify(payload));
      setIsDisabled(true);
    },
    [portalSocket, user_id, socketData]
  );

  const handleConfirmCheckIn = useCallback(
    (value) => {
      const payload = { ...socketData, answer: value };
      portalSocket.send(JSON.stringify(payload));
      console.log(JSON.stringify(payload));
      setConfirmCheckIn(false);
    },
    [portalSocket, socketData]
  );

  return (
    <RequestPortalContext.Provider
      value={{ getSocketData, getSocket, portalSocket, socketData }}
    >
      {children}

      <DateRequestModal
        portalData={portalData}
        hidePortal={hidePortal}
        user={user}
        acceptRequest={acceptRequest}
        rejectRequest={rejectRequest}
      />

      <HeadsUpModal
        isHeadsUp={isHeadsUp}
        headsUpData={headsUpData}
        setIsOpenCamera={setIsOpenCamera}
        handleCancelRequest={handleCancelRequest}
        isDisabled={isDisabled}
      />

      <ScannerModal
        isOpenCamera={isOpenCamera}
        setIsOpenCamera={setIsOpenCamera}
        sendMessageToSocket={sendMessageToSocket}
        socketData={socketData}
      />

      <DateStartedModal isEndDate={isEndDate} timer={timer} endDateFn={endDateFn} />

      <CancelDateModal
        socketData={socketData}
        cancelDate={cancelDate}
        hidePortal={hidePortal}
        handleCancelRequest={handleCancelRequest}
      />

      <DateCanceledModal
        canceledDate={canceledDate}
        setCanceledDate={setCanceledDate}
        socketData={socketData}
      />

      <ConfirmCheckInModal
        confirmCheckIn={confirmCheckIn}
        setConfirmCheckIn={setConfirmCheckIn}
        socketData={socketData}
        handleConfirmCheckIn={handleConfirmCheckIn}
      />

      <CommonPopupModal
        commonPopVisible={commonPopVisible}
        setCommonPopVisible={setCommonPopVisible}
        socketData={socketData}
      />

      <FeedbackModal
        feedbackModal={feedbackModal}
        feedbacks={feedbacks}
        setFeedbacks={setFeedbacks}
        handleFeedback={handleFeedback}
      />
    </RequestPortalContext.Provider>
  );
}

export const useRequestPortal = () => useContext(RequestPortalContext);
