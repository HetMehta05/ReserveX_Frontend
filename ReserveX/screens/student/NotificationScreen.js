import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import AppBackgroundStudents from "../../layouts/AppBackgroundStudents";
import Header from "../../components/Header";
import { useUser } from "../../context/UserContext";
import {
    getNotifications,
    markAllNotificationsRead,
    markNotificationRead,
} from "../../services/api";

// ─── Helpers ───
function timeAgo(dateStr) {
    if (!dateStr) return "";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "JUST NOW";
    if (diffMins < 60) return `${diffMins}M AGO`;
    if (diffHours < 24) return `${diffHours}H AGO`;
    if (diffDays === 1) return "YESTERDAY";
    if (diffDays < 7) return `${diffDays}D AGO`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}

function isToday(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
}

function isYesterday(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
    );
}

// ─── Notification Icon Mapping ───
function getNotificationStyle(notification) {
    const type = (notification.type || notification.category || "").toLowerCase();
    const title = (notification.title || "").toLowerCase();

    if (type.includes("class") || type.includes("timetable") || title.includes("class")) {
        return {
            icon: "school-outline",
            iconType: "MaterialCommunityIcons",
            bgColor: "rgba(0,212,170,0.1)",
            iconColor: "#00D4AA",
        };
    }
    if (type.includes("event") || title.includes("event") || title.includes("reminder")) {
        return {
            icon: "calendar-outline",
            iconType: "Ionicons",
            bgColor: "rgba(194,129,255,0.1)",
            iconColor: "#C281FF",
        };
    }
    if (type.includes("room") || title.includes("room")) {
        return {
            icon: "location-outline",
            iconType: "Ionicons",
            bgColor: "rgba(57,255,20,0.1)",
            iconColor: "#39ff14",
        };
    }
    if (type.includes("booking") || title.includes("booking")) {
        return {
            icon: "checkmark-circle-outline",
            iconType: "Ionicons",
            bgColor: "rgba(0,150,255,0.1)",
            iconColor: "#0096FF",
        };
    }
    // Default
    return {
        icon: "notifications-outline",
        iconType: "Ionicons",
        bgColor: "rgba(255,255,255,0.06)",
        iconColor: "#aaa",
    };
}

// ═══════════════════════════════════════════
//  NOTIFICATION SCREEN
// ═══════════════════════════════════════════
const NotificationScreen = () => {
    const { token } = useUser();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [markingAll, setMarkingAll] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const data = await getNotifications();
            const notifList = Array.isArray(data)
                ? data
                : data.notifications || [];
            // Sort: newest first
            notifList.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
            setNotifications(notifList);
        } catch (err) {
            console.log("Notification fetch error:", err);
            Toast.show({
                type: "error",
                text1: "Failed to load notifications",
                text2: err.message,
                position: "top",
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handleMarkAllRead = async () => {
        try {
            setMarkingAll(true);
            await markAllNotificationsRead();
            // Update local state
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, read: true, isRead: true }))
            );
            Toast.show({
                type: "success",
                text1: "All notifications marked as read",
                position: "top",
            });
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Failed to mark all as read",
                text2: err.message,
                position: "top",
            });
        } finally {
            setMarkingAll(false);
        }
    };

    const handleMarkRead = async (notifId) => {
        try {
            await markNotificationRead(notifId);
            setNotifications((prev) =>
                prev.map((n) =>
                    (n._id || n.id) === notifId
                        ? { ...n, read: true, isRead: true }
                        : n
                )
            );
        } catch (err) {
            console.log("Mark read error:", err);
        }
    };

    // ─── Group notifications ───
    const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;

    const todayNotifs = notifications.filter((n) => isToday(n.createdAt || n.date));
    const earlierNotifs = notifications.filter((n) => !isToday(n.createdAt || n.date));

    // ─── Render ───
    if (loading) {
        return (
            <AppBackgroundStudents>
                <View style={[styles.container, { justifyContent: "center", alignItems: "center", flex: 1 }]}>
                    <ActivityIndicator size="large" color="#C281FF" />
                    <Text style={styles.loadingText}>Loading notifications...</Text>
                </View>
            </AppBackgroundStudents>
        );
    }

    return (
        <AppBackgroundStudents>
            <View style={styles.container}>
                <Header currentScreen="Notifications" />

                {/* Title Row */}
                <View style={styles.titleRow}>
                    <View>
                        <Text style={styles.sectionLabel}>ACTIVITY FEED</Text>
                        <Text style={styles.pageTitle}>Updates</Text>
                    </View>
                    {unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{unreadCount} UNREAD</Text>
                        </View>
                    )}
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#C281FF"
                            colors={["#C281FF"]}
                        />
                    }
                >
                    {notifications.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="notifications-off-outline" size={50} color="rgba(255,255,255,0.2)" />
                            <Text style={styles.emptyTitle}>No Notifications</Text>
                            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
                        </View>
                    ) : (
                        <>
                            {/* ─── Today Section ─── */}
                            {todayNotifs.length > 0 && (
                                <>
                                    <View style={styles.sectionHeaderRow}>
                                        <Text style={styles.groupTitle}>Today</Text>
                                        <TouchableOpacity
                                            onPress={handleMarkAllRead}
                                            disabled={markingAll || unreadCount === 0}
                                            style={styles.markAllBtn}
                                        >
                                            {markingAll ? (
                                                <ActivityIndicator size="small" color="#C281FF" />
                                            ) : (
                                                <Text style={[
                                                    styles.markAllText,
                                                    unreadCount === 0 && { opacity: 0.3 },
                                                ]}>
                                                    MARK ALL READ
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>

                                    {todayNotifs.map((notif) => (
                                        <NotificationCard
                                            key={notif._id || notif.id}
                                            notification={notif}
                                            onPress={() => handleMarkRead(notif._id || notif.id)}
                                        />
                                    ))}
                                </>
                            )}

                            {/* ─── Earlier Section ─── */}
                            {earlierNotifs.length > 0 && (
                                <>
                                    <View style={styles.sectionHeaderRow}>
                                        <Text style={styles.groupTitle}>Earlier</Text>
                                        {todayNotifs.length === 0 && (
                                            <TouchableOpacity
                                                onPress={handleMarkAllRead}
                                                disabled={markingAll || unreadCount === 0}
                                                style={styles.markAllBtn}
                                            >
                                                {markingAll ? (
                                                    <ActivityIndicator size="small" color="#C281FF" />
                                                ) : (
                                                    <Text style={[
                                                        styles.markAllText,
                                                        unreadCount === 0 && { opacity: 0.3 },
                                                    ]}>
                                                        MARK ALL READ
                                                    </Text>
                                                )}
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {earlierNotifs.map((notif) => (
                                        <NotificationCard
                                            key={notif._id || notif.id}
                                            notification={notif}
                                            onPress={() => handleMarkRead(notif._id || notif.id)}
                                        />
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>
        </AppBackgroundStudents>
    );
};

// ─── Notification Card ───
function NotificationCard({ notification, onPress }) {
    const notifStyle = getNotificationStyle(notification);
    const isUnread = !notification.read && !notification.isRead;
    const timestamp = timeAgo(notification.createdAt || notification.date);

    // Highlight keywords in message
    const renderMessage = (message) => {
        if (!message) return null;
        // Simple keyword highlighting for subject names
        const highlighted = message;
        return (
            <Text style={styles.notifMessage}>
                {highlighted}
            </Text>
        );
    };

    return (
        <TouchableOpacity
            style={[
                styles.notifCard,
                isUnread && styles.notifCardUnread,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Icon */}
            <View style={[styles.notifIconBox, { backgroundColor: notifStyle.bgColor }]}>
                <Ionicons
                    name={notifStyle.icon}
                    size={22}
                    color={notifStyle.iconColor}
                />
            </View>

            {/* Content */}
            <View style={styles.notifContent}>
                <View style={styles.notifTopRow}>
                    <Text style={[styles.notifTitle, isUnread && styles.notifTitleUnread]} numberOfLines={1}>
                        {notification.title || "Notification"}
                    </Text>
                    <Text style={styles.notifTime}>{timestamp}</Text>
                </View>
                {renderMessage(notification.message || notification.body || notification.description)}
            </View>
        </TouchableOpacity>
    );
}

export default NotificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
    },

    loadingText: {
        color: "rgba(255,255,255,0.4)",
        marginTop: 12,
        fontSize: 14,
    },

    // ─── Title ───
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: 20,
    },

    sectionLabel: {
        color: "#00D4AA",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 2,
        marginBottom: 4,
    },

    pageTitle: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
    },

    unreadBadge: {
        paddingBottom: 6,
    },

    unreadText: {
        color: "rgba(255,255,255,0.4)",
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 1,
    },

    // ─── Scroll ───
    scrollContent: {
        paddingBottom: 140,
    },

    // ─── Section Headers ───
    sectionHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        marginTop: 6,
    },

    groupTitle: {
        color: "#00D4AA",
        fontSize: 16,
        fontWeight: "600",
    },

    markAllBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.12)",
        backgroundColor: "rgba(255,255,255,0.04)",
    },

    markAllText: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.8,
    },

    // ─── Notification Card ───
    notifCard: {
        flexDirection: "row",
        alignItems: "flex-start",
        padding: 16,
        borderRadius: 18,
        marginBottom: 12,
        backgroundColor: "rgba(255,255,255,0.04)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    notifCardUnread: {
        backgroundColor: "rgba(255,255,255,0.07)",
        borderColor: "rgba(255,255,255,0.12)",
    },

    notifIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    notifContent: {
        flex: 1,
    },

    notifTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },

    notifTitle: {
        color: "rgba(255,255,255,0.7)",
        fontSize: 15,
        fontWeight: "600",
        flex: 1,
        marginRight: 8,
    },

    notifTitleUnread: {
        color: "#fff",
    },

    notifTime: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 10,
        fontWeight: "600",
        letterSpacing: 0.3,
    },

    notifMessage: {
        color: "rgba(255,255,255,0.45)",
        fontSize: 13,
        lineHeight: 19,
    },

    // ─── Empty ───
    emptyState: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 80,
    },

    emptyTitle: {
        color: "rgba(255,255,255,0.5)",
        fontSize: 18,
        fontWeight: "600",
        marginTop: 16,
    },

    emptySubtitle: {
        color: "rgba(255,255,255,0.3)",
        fontSize: 14,
        marginTop: 6,
    },
});