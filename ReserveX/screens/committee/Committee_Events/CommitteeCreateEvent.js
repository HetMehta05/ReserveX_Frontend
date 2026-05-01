import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Platform,
    ScrollView,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Change to your server address ─────────────────────────
const BASE_URL = 'https://reservex.onrender.com/api';

// ── API helpers ───────────────────────────────────────────

// POST /events  →  router.post('/', auth, ...)
const createEvent = async (payload, token) => {
    const response = await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create event');
    }
    return response.json();
};

// GET /:eventId/registration-form  →  router.get('/:eventId/registration-form', ...)
const fetchRegistrationForm = async (eventId) => {
    const response = await fetch(`${BASE_URL}/events/${eventId}/registration-form`);
    if (!response.ok) throw new Error('Failed to fetch registration form');
    return response.json();
};

// ─────────────────────────────────────────────────────────

const SUGGESTED_TAGS = ['Tech', 'Workshop', 'Design', 'Sports', 'Cultural', 'Hackathon'];

export default function CreateEditEventScreen({ navigation, route }) {
    const existingEvent = route?.params?.event || null;
    const isEditing = existingEvent !== null;

    const [activeTab, setActiveTab] = useState('events');
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [venue, setVenue] = useState('');
    const [loading, setLoading] = useState(false);
    const [regFormLoading, setRegFormLoading] = useState(false);

    // Pre-fill when editing
    useEffect(() => {
        if (existingEvent) {
            setEventName(existingEvent.title || '');
            setDescription(existingEvent.description || '');
            setTags(existingEvent.tags || []);
            setDate(existingEvent.date || '');
            setTime(existingEvent.time || '');
            setVenue(existingEvent.venue || '');
        }
    }, [existingEvent]);

    const addTag = (value) => {
        const trimmed = value.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags((prev) => [...prev, trimmed]);
        }
        setTagInput('');
    };

    const removeTag = (tag) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };

    // POST /events  →  router.post('/', auth, ...)
    const handleFinish = async () => {
        if (!eventName.trim()) {
            Alert.alert('Validation', 'Event name is required.');
            return;
        }

        const payload = {
            title: eventName.trim(),
            description: description.trim(),
            tags,
            date: date.trim(),
            time: time.trim(),
            venue: venue.trim(),
        };

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('authToken');
            const data = await createEvent(payload, token);

            Alert.alert('Success', data.message || 'Event created!', [
                {
                    text: 'OK',
                    onPress: () => navigation?.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert('Error', error.message || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    // GET /:eventId/registration-form  →  router.get('/:eventId/registration-form', ...)
    const handleViewRegistrationForm = async () => {
        if (!existingEvent?._id) {
            Alert.alert('Info', 'Save the event first to view its registration form.');
            return;
        }
        try {
            setRegFormLoading(true);
            const data = await fetchRegistrationForm(existingEvent._id);
            navigation?.navigate('RegistrationForm', { form: data, eventId: existingEvent._id });
        } catch (error) {
            Alert.alert('Error', error.message || 'Could not load registration form.');
        } finally {
            setRegFormLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#0a1f3a" />

            <LinearGradient
                colors={['#0a1f3a', '#0a2a2a', '#060f1a', '#000000']}
                locations={[0, 0.4, 0.7, 1]}
                style={styles.gradient}
            >
                {/* ── Navbar ── */}
                <View style={styles.navbar}>
                    <Text style={styles.brand}>ReserveX</Text>
                    <View style={styles.navRight}>
                        <TouchableOpacity style={styles.bellBtn}>
                            <Ionicons name="notifications-outline" size={22} color="#c8ede4" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.avatarBtn}>
                            <Ionicons name="person-outline" size={22} color="#c8ede4" />
                        </TouchableOpacity>
                    </View>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.flex}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* ── Page Header ── */}
                        <Text style={styles.pageSubtitle}>DJSCE UNICODE</Text>
                        <Text style={styles.pageTitle}>
                            {isEditing ? 'Edit Event' : 'Create/Edit Event'}
                        </Text>

                        {/* ── Event Name ── */}
                        <Text style={styles.fieldLabel}>EVENT NAME</Text>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                value={eventName}
                                onChangeText={setEventName}
                                placeholderTextColor="rgba(160,212,200,0.3)"
                                selectionColor="#0e9e85"
                            />
                        </View>

                        {/* ── Description ── */}
                        <Text style={styles.fieldLabel}>DESCRIPTION</Text>
                        <View style={[styles.inputBox, styles.textAreaBox]}>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={description}
                                onChangeText={setDescription}
                                placeholderTextColor="rgba(160,212,200,0.3)"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                selectionColor="#0e9e85"
                            />
                        </View>

                        {/* ── Tags ── */}
                        <Text style={styles.fieldLabel}>TAGS</Text>
                        <View style={styles.tagsBox}>
                            <View style={styles.tagsWrap}>
                                {tags.map((tag) => (
                                    <TouchableOpacity
                                        key={tag}
                                        style={styles.tag}
                                        onPress={() => removeTag(tag)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.tagText}>{tag}</Text>
                                        <Ionicons name="close" size={11} color="#fff" style={{ marginLeft: 4 }} />
                                    </TouchableOpacity>
                                ))}
                                <TextInput
                                    style={styles.tagInput}
                                    value={tagInput}
                                    onChangeText={setTagInput}
                                    onSubmitEditing={() => addTag(tagInput)}
                                    placeholder="Add tag..."
                                    placeholderTextColor="rgba(160,212,200,0.3)"
                                    returnKeyType="done"
                                    selectionColor="#0e9e85"
                                />
                            </View>
                            <View style={styles.suggestedWrap}>
                                {SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((t) => (
                                    <TouchableOpacity
                                        key={t}
                                        style={styles.suggestedTag}
                                        onPress={() => addTag(t)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.suggestedTagText}>{t}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* ── Date ── */}
                        <Text style={styles.fieldLabel}>DATE</Text>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                value={date}
                                onChangeText={setDate}
                                placeholder="e.g. 20th & 21st April"
                                placeholderTextColor="rgba(160,212,200,0.3)"
                                selectionColor="#0e9e85"
                            />
                        </View>

                        {/* ── Time ── */}
                        <Text style={styles.fieldLabel}>TIME</Text>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                value={time}
                                onChangeText={setTime}
                                placeholder="e.g. 9:00 - 5:00"
                                placeholderTextColor="rgba(160,212,200,0.3)"
                                selectionColor="#0e9e85"
                            />
                        </View>

                        {/* ── Venue ── */}
                        <Text style={styles.fieldLabel}>VENUE</Text>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                value={venue}
                                onChangeText={setVenue}
                                placeholder="e.g. Seminar Hall, 3rd Floor"
                                placeholderTextColor="rgba(160,212,200,0.3)"
                                selectionColor="#0e9e85"
                            />
                        </View>

                        {/* ── View Registration Form (edit mode only) ── */}
                        {isEditing && (
                            <TouchableOpacity
                                style={styles.regFormBtn}
                                onPress={handleViewRegistrationForm}
                                activeOpacity={0.8}
                                disabled={regFormLoading}
                            >
                                {regFormLoading ? (
                                    <ActivityIndicator size="small" color="#a0d4c8" />
                                ) : (
                                    <>
                                        <Ionicons name="document-text-outline" size={15} color="#a0d4c8" />
                                        <Text style={styles.regFormBtnText}>View Registration Form</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}

                        {/* ── Finish Button ── */}
                        <TouchableOpacity
                            style={[styles.finishBtn, loading && styles.finishBtnDisabled]}
                            onPress={handleFinish}
                            activeOpacity={0.85}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#0e9e85" />
                            ) : (
                                <Text style={styles.finishBtnText}>FINISH</Text>
                            )}
                        </TouchableOpacity>

                        <View style={{ height: 16 }} />
                    </ScrollView>
                </KeyboardAvoidingView>

            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#0a1f3a' },
    gradient: { flex: 1 },
    flex: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 10 },

    navbar: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 16 : 10, paddingBottom: 6,
    },
    brand: { color: '#c8ede4', fontSize: 18, fontWeight: '700', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5 },
    navRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    bellBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
    avatarBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)' },

    pageSubtitle: { color: '#67DCE6', fontSize: 12, letterSpacing: 1.5, marginBottom: 4, marginTop: 8, fontWeight: '700' },
    pageTitle: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginBottom: 25 },

    fieldLabel: { color: '#67DCE6', fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 8 },

    inputBox: { backgroundColor: 'rgba(53, 94, 99, 0.65)', borderRadius: 16, paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 16 : 10, marginBottom: 22 },
    input: { color: '#fff', fontSize: 15 },
    textAreaBox: { paddingVertical: Platform.OS === 'ios' ? 14 : 10 },
    textArea: { height: 110, textAlignVertical: 'top' },

    tagsBox: { backgroundColor: 'rgba(53, 94, 99, 0.65)', borderRadius: 16, padding: 14, marginBottom: 22 },
    tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, minHeight: 40 },
    tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#314154', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
    tagText: { color: '#67DCE6', fontSize: 12, fontWeight: '600' },
    tagInput: { color: '#fff', fontSize: 14, minWidth: 80, flex: 1, paddingVertical: 2 },
    suggestedWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
    suggestedTag: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
    suggestedTagText: { color: '#ccc', fontSize: 12 },

    finishBtn: { marginTop: 15, alignSelf: 'center', borderRadius: 30, backgroundColor: '#67DCE6', paddingVertical: 14, paddingHorizontal: 40, minWidth: 160, alignItems: 'center' },
    finishBtnDisabled: { opacity: 0.5 },
    finishBtnText: { color: '#0B132F', fontSize: 14, fontWeight: 'bold', letterSpacing: 1.0 },

    // removed manual tabs
});
