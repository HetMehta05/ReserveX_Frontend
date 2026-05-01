import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from "react-native-reanimated";
import AppBackgroundCommittee from '../../../layouts/AppBackgroundCommittee';
import Header from '../../../components/Header';

// ── Shared metrics ──
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.82;
const CARD_SPACING = 16;
const SIDE_PADDING = (width - CARD_WIDTH) / 2;

// ── Change to your server address ──
const BASE_URL = 'https://reservex.onrender.com/api';

// ── API helpers ───────────────────────────────────────────

// GET /events  →  router.get('/', ...)
const fetchAllEvents = async () => {
  const response = await fetch(`${BASE_URL}/events`);
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};

// GET /:eventId/announcements  →  router.get('/:eventId/announcements', ...)
const fetchAnnouncements = async (eventId) => {
  const response = await fetch(`${BASE_URL}/events/${eventId}/announcements`);
  if (!response.ok) throw new Error('Failed to fetch announcements');
  return response.json();
};

// POST /:eventId/register  →  router.post('/:eventId/register', auth, ...)
const registerForEvent = async (eventId, token) => {
  const response = await fetch(`${BASE_URL}/events/${eventId}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Registration failed');
  return response.json();
};

// ─────────────────────────────────────────────────────────

function AnimatedEventCard({ event, index, scrollX, onEdit, onDelete }) {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (index - 1) * (CARD_WIDTH + CARD_SPACING),
            index * (CARD_WIDTH + CARD_SPACING),
            (index + 1) * (CARD_WIDTH + CARD_SPACING),
        ];
        const scale = interpolate(scrollX.value, inputRange, [0.88, 1, 0.88], Extrapolation.CLAMP);
        const rotateY = interpolate(scrollX.value, inputRange, [8, 0, -8], Extrapolation.CLAMP);
        const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolation.CLAMP);
        const translateY = interpolate(scrollX.value, inputRange, [15, 0, 15], Extrapolation.CLAMP);

        return {
            transform: [{ perspective: 1200 }, { scale }, { rotateY: `${rotateY}deg` }, { translateY }],
            opacity,
        };
    });

  return (
    <Animated.View style={[styles.cardOuter, animatedStyle]}>
        <View style={styles.card}>
        {event.imageUrl ? (
            <Image source={{ uri: event.imageUrl }} style={styles.cardImage} resizeMode="cover" />
        ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <MaterialCommunityIcons name="calendar-star" size={50} color="rgba(160,212,200,0.3)" />
            </View>
        )}

        <View style={styles.cardBody}>
            <Text style={styles.cardTitle} numberOfLines={1}>{event.title}</Text>
            <Text style={styles.cardOrganizer}>{event.organizer || 'BY DJSCE UNICODE'}</Text>
            <Text style={styles.cardDescription} numberOfLines={2}>{event.description}</Text>

            <View style={styles.timeDateRow}>
            <View style={styles.metaBlock}>
                <Ionicons name="time-outline" size={22} color="#67DCE6" style={styles.metaIcon} />
                <View>
                <Text style={styles.metaLabel}>DATE</Text>
                <Text style={styles.metaValue}>{event.date || 'TBA'}</Text>
                </View>
            </View>
            <View style={styles.metaBlock}>
                <Ionicons name="time-outline" size={22} color="#67DCE6" style={styles.metaIcon} />
                <View>
                <Text style={styles.metaLabel}>TIME</Text>
                <Text style={styles.metaValue}>{event.time || 'TBA'}</Text>
                </View>
            </View>
            </View>

            <View style={[styles.metaBlock, { marginBottom: 12 }]}>
            <Ionicons name="location-outline" size={22} color="#67DCE6" style={styles.metaIcon} />
            <View>
                <Text style={styles.metaLabel}>VENUE</Text>
                <Text style={styles.metaValue}>{event.venue || 'TBA'}</Text>
            </View>
            </View>

            <View style={styles.cardActions}>
            <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(event)} activeOpacity={0.8}>
                <Text style={styles.editBtnText}>EDIT EVENT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(event._id)} activeOpacity={0.8}>
                <Text style={styles.deleteBtnText}>DELETE</Text>
            </TouchableOpacity>
            </View>
        </View>
        </View>
    </Animated.View>
  );
}

export default function MyEventsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET /events
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllEvents();
      // Backend returns array directly or wrapped — handle both
      setEvents(Array.isArray(data) ? data : data.events || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleEdit = (event) => {
    navigation?.navigate('CreateEditEvent', { event });
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setEvents((prev) => prev.filter((e) => e._id !== id)),
      },
    ]);
  };

  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
      onScroll: (event) => {
          scrollX.value = event.contentOffset.x;
      },
  });

  const handleAddEvent = () => {
    navigation?.navigate('CreateEditEvent', { event: null });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1a2e" />

      <AppBackgroundCommittee>
        <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {/* ── Navbar ── */}
          <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
            <Header />
          </View>

          {/* ── Page Header ── */}
          <View style={styles.pageHeader}>
            <View>
              <Text style={styles.pageSubtitle}>DJSCE UNICODE</Text>
              <Text style={styles.pageTitle}>My Events</Text>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddEvent} activeOpacity={0.8}>
              <Ionicons name="add" size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ── Content ── */}
          {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0e9e85" />
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Ionicons name="cloud-offline-outline" size={48} color="rgba(160,212,200,0.3)" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadEvents}>
              <Text style={styles.retryBtnText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ marginTop: 10 }}>
            {events.length === 0 ? (
                <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="rgba(160,212,200,0.3)" />
                <Text style={styles.emptyText}>No events yet</Text>
                <Text style={styles.emptySubText}>Tap + to create your first event</Text>
              </View>
            ) : (
                <Animated.FlatList
                    data={events}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
                    snapToInterval={CARD_WIDTH + CARD_SPACING}
                    decelerationRate="fast"
                    bounces={false}
                    contentContainerStyle={{
                        paddingHorizontal: SIDE_PADDING,
                        paddingBottom: 20,
                    }}
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
                    renderItem={({ item, index }) => (
                        <AnimatedEventCard
                            event={item}
                            index={index}
                            scrollX={scrollX}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    )}
                />
            )}
          </View>
        )}
        </ScrollView>
      </AppBackgroundCommittee>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a1f3a' },
  gradient: { flex: 1 },

  navbar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 16 : 10, paddingBottom: 6,
  },
  brand: {
    color: '#c8ede4', fontSize: 18, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5,
  },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  avatarBtn: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
  },

  pageHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16,
  },
  pageSubtitle: {
    color: 'rgba(160,212,200,0.7)', fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 1.5, marginBottom: 4,
  },
  pageTitle: {
    color: '#e0f5ef', fontSize: 28, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5,
  },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#0e9e85',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#0e9e85', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6,
  },

  cardOuter: {
    width: CARD_WIDTH,
  },

  listContent: { paddingHorizontal: 16, paddingBottom: 12 },

  card: {
    backgroundColor: '#1C1635', borderRadius: 22,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.05)",
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 130 },
  cardImagePlaceholder: { backgroundColor: 'rgba(255,255,255,0.04)', justifyContent: 'center', alignItems: 'center' },
  cardBody: { padding: 16 },
  cardTitle: {
    color: '#fff', fontSize: 22, fontWeight: 'bold',
    marginBottom: 4,
  },
  cardOrganizer: {
    color: '#67DCE6', fontSize: 12,
    letterSpacing: 0.5, marginBottom: 8,
  },
  cardDescription: {
    color: '#d0d0d0', fontSize: 13,
    lineHeight: 20, marginBottom: 14,
  },

  timeDateRow: { flexDirection: 'row', gap: 30, marginBottom: 12 },
  metaBlock: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  metaIcon: { marginRight: 12, backgroundColor: 'rgba(255,255,255,0.05)', padding: 6, borderRadius: 20 },
  metaLabel: {
    color: '#888', fontSize: 11,
    letterSpacing: 1, marginBottom: 2,
  },
  metaValue: {
    color: '#fff', fontSize: 13, fontWeight: '600'
  },

  cardActions: { flexDirection: 'row', gap: 10, marginTop: 4 },
  editBtn: { flex: 1, backgroundColor: '#67DCE6', borderRadius: 25, paddingVertical: 10, alignItems: 'center' },
  editBtnText: {
    color: '#0B132F', fontSize: 12, fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  deleteBtn: { flex: 1, backgroundColor: '#FF1717', borderRadius: 25, paddingVertical: 10, alignItems: 'center' },
  deleteBtnText: {
    color: '#fff', fontSize: 12, fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: 'rgba(160,212,200,0.6)', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  errorText: { color: '#e07070', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', textAlign: 'center', paddingHorizontal: 40 },
  retryBtn: { marginTop: 4, borderWidth: 1, borderColor: '#0e9e85', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 8 },
  retryBtnText: { color: '#0e9e85', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 10 },
  emptyText: { color: 'rgba(160,212,200,0.5)', fontSize: 18, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  emptySubText: { color: 'rgba(160,212,200,0.35)', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },

    // Removed manual tab bar styles
});
