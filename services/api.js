const BASE_URL = "https://reserevex.onrender.com/api";

export const getAvailableRooms = async () => {
    const now = new Date();

    const date = now.toISOString().split("T")[0];
    const startTime = now.toTimeString().slice(0, 5);

    const end = new Date(now.getTime() + 60 * 60 * 1000);
    const endTime = end.toTimeString().slice(0, 5);

    const response = await fetch(
        `${BASE_URL}/rooms/available?date=${date}&startTime=${startTime}&endTime=${endTime}`,
        {
            headers: {
                "Content-Type": "application/json",
                // Add token later if using auth
                // Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();
    return data.availableRooms;
};


export const getRoomStatus = async () => {
    const today = new Date().toISOString().split("T")[0];

    const response = await fetch(
        `${BASE_URL}/rooms/status?date=${today}`
    );

    const data = await response.json();
    return data.rooms;
};