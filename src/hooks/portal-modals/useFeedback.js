import getApiUrl from "@/constant/apiUrl";
import { defaultFeedbacks } from "@/constant/portal-modals/feedbackConstants";
import { useCallback, useState } from "react";

export default function useFeedback(token, socketData) {
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState(defaultFeedbacks);

  const handleFeedback = useCallback(async () => {
    try {
      const apiURL = getApiUrl();

      const response = await fetch(`${apiURL}/setDateFeedback`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...feedbacks,
          dateRequestId: socketData?.data?._id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const obj = await response.json();
      if (!obj.status) {
        console.log(obj.message);
        return;
      }

      setFeedbackModal(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  }, [feedbacks, token, socketData]);

  return {
    feedbackModal,
    setFeedbackModal,
    feedbacks,
    setFeedbacks,
    handleFeedback,
  };
}
