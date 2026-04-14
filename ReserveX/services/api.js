import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_URL = "https://reservex.onrender.com/api";

// ─── Helper: get auth headers ───
const getAuthHeaders = async () => {
    const token = await AsyncStorage.getItem("accessToken");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// ═══════════════════════════════════════════
//  ROOMS
// ═══════════════════════════════════════════

export const getAvailableRooms = async (date, startTime, endTime) => {
    const headers = await getAuthHeaders();

    // Default to current time + 1hr window if not specified
    if (!date || !startTime || !endTime) {
        const now = new Date();
        date = now.toISOString().split("T")[0];
        startTime = now.toTimeString().slice(0, 5);
        const end = new Date(now.getTime() + 60 * 60 * 1000);
        endTime = end.toTimeString().slice(0, 5);
    }

    const response = await fetch(
        `${BASE_URL}/rooms/available?date=${date}&startTime=${startTime}&endTime=${endTime}`,
        { headers }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch available rooms");
    return data.availableRooms || data;
};

export const getAllRooms = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/rooms`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch rooms");
    return data;
};

export const getRoomStatus = async (date) => {
    const headers = await getAuthHeaders();
    if (!date) date = new Date().toISOString().split("T")[0];

    const response = await fetch(
        `${BASE_URL}/rooms/status?date=${date}`,
        { headers }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch room status");
    return data.rooms || data;
};

export const getRoomDetails = async (roomId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/rooms/${roomId}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch room details");
    return data;
};

// ═══════════════════════════════════════════
//  EVENTS
// ═══════════════════════════════════════════

export const getAllEvents = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/events`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch events");
    return data;
};

export const getEventDetails = async (eventId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/events/${eventId}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch event details");
    return data;
};

export const registerForEvent = async (eventId, formData = {}) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/events/${eventId}/register`, {
        method: "POST",
        headers,
        body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to register for event");
    return data;
};

export const getEventAnnouncements = async (eventId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/events/${eventId}/announcements`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch announcements");
    return data;
};

// ═══════════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════════

export const getNotifications = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/notifications`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch notifications");
    return data;
};

export const markAllNotificationsRead = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to mark all as read");
    return data;
};

export const markNotificationRead = async (notificationId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/notifications/read/${notificationId}`, {
        method: "PATCH",
        headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to mark notification as read");
    return data;
};

// ═══════════════════════════════════════════
//  USERS / PROFILE
// ═══════════════════════════════════════════

export const getStudentProfile = async (userId) => {
    const headers = await getAuthHeaders();

    const response = await fetch(
        `${BASE_URL}/users/students/${userId}`,
        {
            method: "GET",
            headers,
        }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch profile");
    return data;
};

export const getUserProfile = async (userId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/users/${userId}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch user profile");
    return data;
};

export const updateUserProfile = async (userId, updates) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updates),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to update profile");
    return data;
};

export const deleteUserAccount = async (userId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to delete account");
    return data;
};

// ═══════════════════════════════════════════
//  TIMETABLE
// ═══════════════════════════════════════════

export const getStudentTimetable = async (studentId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/timetable/student/${studentId}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch timetable");
    return data;
};

export const getRoomTimetable = async (roomId) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/timetable/room/${roomId}`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch room timetable");
    return data;
};

// ═══════════════════════════════════════════
//  BOOKINGS
// ═══════════════════════════════════════════

export const createBooking = async (bookingData) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers,
        body: JSON.stringify(bookingData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to create booking");
    return data;
};

export const getMyBookings = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/bookings`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch bookings");
    return data;
};

// ═══════════════════════════════════════════
//  ACADEMIC
// ═══════════════════════════════════════════

export const getDepartments = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/academic/departments`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch departments");
    return data;
};

// ═══════════════════════════════════════════
//  SCHEDULE / TIME SLOTS
// ═══════════════════════════════════════════

export const getTimeSlots = async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${BASE_URL}/schedule/time-slots`, { headers });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch time slots");
    return data;
};