// import getApiUrl from "@/constant/apiUrl";

// export const getUsersListApi = async (token, shopId, timeZone) => {
//     const res = await fetch(`${getApiUrl()}/getAreaUsers`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify({ shopId, timeZone }),
//     });
//     return res.json();
// };

// export const checkInApi = async (token, data) => {
//     const res = await fetch(`${getApiUrl()}/setCheckIn`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//     });
//     return res.json();
// };


import getApiUrl from "@/constant/apiUrl";

export const getUsersListApi = async (token, shopId, timeZone, signal) => {
    const res = await fetch(`${getApiUrl()}/getAreaUsers`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ shopId, timeZone }),
        signal,
    });

    return res.json();
};

export const checkInApi = async (token, data, signal) => {
    const res = await fetch(`${getApiUrl()}/setCheckIn`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        signal,
    });

    return res.json();
};
