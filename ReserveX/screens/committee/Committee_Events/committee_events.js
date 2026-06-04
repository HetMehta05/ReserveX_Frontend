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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppBackgroundCommittee from '../../../layouts/AppBackgroundCommittee';
import Header from '../../../components/Header';

// ── Change to your server address ─────────────────────────
const BASE_URL = 'http://localhost:3000/api';

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

function EventCard({ event, onEdit, onDelete, onRegister, onViewAnnouncements }) {
  return (
    <View style={styles.card}>
      {event.imageUrl ? (
        <Image source={{ uri: event.imageUrl }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Ionicons name="image-outline" size={36} color="rgba(160,212,200,0.3)" />
        </View>
      )}

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{event.title}</Text>
        <Text style={styles.cardOrganizer}>{event.organizer || 'BY DJSCE UNICODE'}</Text>
        <Text style={styles.cardDescription} numberOfLines={3}>{event.description}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="time-outline" size={14} color="#a0d4c8" />
          <View style={styles.metaGroup}>
            <View style={styles.metaTexts}>
              <Text style={styles.metaLabel}>DATE</Text>
              <Text style={styles.metaValue}>{event.date}</Text>
            </View>
            <View style={styles.metaTexts}>
              <Text style={styles.metaLabel}>TIME</Text>
              <Text style={styles.metaValue}>{event.time}</Text>
            </View>
          </View>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color="#a0d4c8" />
          <View style={styles.metaTexts}>
            <Text style={styles.metaLabel}>VENUE</Text>
            <Text style={styles.metaValue}>{event.venue}</Text>
          </View>
        </View>

        {/* Announcements link */}
        <TouchableOpacity
          style={styles.announcementsBtn}
          onPress={() => onViewAnnouncements(event._id)}
          activeOpacity={0.7}
        >
          <Ionicons name="megaphone-outline" size={13} color="#a0d4c8" />
          <Text style={styles.announcementsBtnText}>View Announcements</Text>
        </TouchableOpacity>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(event)} activeOpacity={0.8}>
            <Text style={styles.editBtnText}>EDIT EVENT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(event._id)} activeOpacity={0.8}>
            <Text style={styles.deleteBtnText}>DELETE</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.registerBtn} onPress={() => onRegister(event._id)} activeOpacity={0.8}>
          <Text style={styles.registerBtnText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
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

  // POST /:eventId/register
  const handleRegister = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const data = await registerForEvent(eventId, token);
      Alert.alert('Success', data.message || 'Registered successfully!');
    } catch (err) {
      Alert.alert('Error', err.message || 'Registration failed.');
    }
  };

  // GET /:eventId/announcements
  const handleViewAnnouncements = async (eventId) => {
    try {
      const data = await fetchAnnouncements(eventId);
      navigation?.navigate('Announcements', { announcements: data, eventId });
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not load announcements.');
    }
  };

  const handleAddEvent = () => {
    navigation?.navigate('CreateEditEvent', { event: null });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1a2e" />

      <AppBackgroundCommittee>
        {/* ── Navbar ── */}
        <View style={{ padding: 10 }}>
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
          <FlatList
            data={events}
            keyExtractor={(item) => item._id?.toString() || item.id?.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRegister={handleRegister}
                onViewAnnouncements={handleViewAnnouncements}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color="rgba(160,212,200,0.3)" />
                <Text style={styles.emptyText}>No events yet</Text>
                <Text style={styles.emptySubText}>Tap + to create your first event</Text>
              </View>
            }
          />
        )}

        {/* ── Bottom Tab Bar ── */}
        <LinearGradient colors={['#0d0d2e', '#1a0a40']} style={styles.tabBar}>
          {[
            { key: 'dash', label: 'dash', icon: <Ionicons name="home-outline" size={22} color={activeTab === 'dash' ? '#c0b0ff' : 'rgba(190,190,230,0.55)'} /> },
            { key: 'events', label: 'events', icon: <MaterialIcons name="event" size={22} color={activeTab === 'events' ? '#c0b0ff' : 'rgba(190,190,230,0.55)'} /> },
            { key: 'news', label: 'news', icon: <MaterialIcons name="article" size={22} color={activeTab === 'news' ? '#c0b0ff' : 'rgba(190,190,230,0.55)'} /> },
          ].map(({ key, label, icon }) => (
            <TouchableOpacity key={key} style={styles.tabItem} onPress={() => setActiveTab(key)} activeOpacity={0.7}>
              <View style={[styles.tabIconWrap, activeTab === key && styles.tabIconWrapActive]}>{icon}</View>
              <Text style={[styles.tabLabel, activeTab === key && styles.tabLabelActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </LinearGradient>
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

  listContent: { paddingHorizontal: 16, paddingBottom: 12 },

  card: {
    backgroundColor: 'rgba(10,30,50,0.85)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(160,212,200,0.15)', overflow: 'hidden', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  cardImage: { width: '100%', height: 160 },
  cardImagePlaceholder: { backgroundColor: 'rgba(255,255,255,0.04)', justifyContent: 'center', alignItems: 'center' },
  cardBody: { padding: 16 },
  cardTitle: {
    color: '#e0f5ef', fontSize: 22, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', marginBottom: 2,
  },
  cardOrganizer: {
    color: 'rgba(160,212,200,0.6)', fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5, marginBottom: 10,
  },
  cardDescription: {
    color: 'rgba(220,240,235,0.75)', fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', lineHeight: 20, marginBottom: 14,
  },

  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 10 },
  metaGroup: { flexDirection: 'row', gap: 20 },
  metaTexts: { marginRight: 4 },
  metaLabel: {
    color: 'rgba(160,212,200,0.55)', fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 1, marginBottom: 1,
  },
  metaValue: {
    color: '#e0f5ef', fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },

  announcementsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginBottom: 14, paddingVertical: 6,
  },
  announcementsBtnText: {
    color: '#a0d4c8', fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5,
  },

  cardActions: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  editBtn: { flex: 1, backgroundColor: '#0e9e85', borderRadius: 8, paddingVertical: 11, alignItems: 'center' },
  editBtnText: {
    color: '#fff', fontSize: 13, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5,
  },
  deleteBtn: { flex: 1, backgroundColor: '#e03e3e', borderRadius: 8, paddingVertical: 11, alignItems: 'center' },
  deleteBtnText: {
    color: '#fff', fontSize: 13, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5,
  },
  registerBtn: {
    backgroundColor: 'rgba(14,158,133,0.15)', borderRadius: 8, paddingVertical: 11,
    alignItems: 'center', borderWidth: 1, borderColor: 'rgba(14,158,133,0.5)',
  },
  registerBtnText: {
    color: '#0e9e85', fontSize: 13, fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5,
  },

  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { color: 'rgba(160,212,200,0.6)', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  errorText: { color: '#e07070', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', textAlign: 'center', paddingHorizontal: 40 },
  retryBtn: { marginTop: 4, borderWidth: 1, borderColor: '#0e9e85', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 8 },
  retryBtnText: { color: '#0e9e85', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 10 },
  emptyText: { color: 'rgba(160,212,200,0.5)', fontSize: 18, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },
  emptySubText: { color: 'rgba(160,212,200,0.35)', fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace' },

  tabBar: {
    flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(120,80,220,0.3)',
    paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 12, paddingHorizontal: 10,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIconWrap: { padding: 5, borderRadius: 8 },
  tabIconWrapActive: { backgroundColor: 'rgba(124,58,237,0.2)' },
  tabLabel: { color: 'rgba(190,190,230,0.5)', fontSize: 11, marginTop: 3, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5 },
  tabLabelActive: { color: '#c0b0ff' },
});
