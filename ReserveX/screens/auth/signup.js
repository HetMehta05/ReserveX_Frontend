import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AppBackgroundStudent from "../../layouts/AppBackgroundStudents";

export default function SignupScreen() {
  const navigation = useNavigation();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [activeTab, setActiveTab] = useState('Signup_Student');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (loading) return;

    if (!form.username || !form.password || !form.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all fields',
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
      });
      return;
    }

    try {
      setLoading(true);

      // 🔁 Replace with your signup API
      const response = await fetch('https://reserveX.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.username.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      Toast.show({
        type: 'success',
        text1: 'Signup Successful',
        text2: 'Account created successfully!',
      });

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#000' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <AppBackgroundStudent>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 120, }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >


          <View style={styles.container}>

            <Text style={styles.logo}>ReserveX</Text>

            <Image
              source={require('../../assets/loginPage_img.png')}
              style={styles.image}
              resizeMode="contain"
            />

            <BlurView intensity={40} tint="dark" style={styles.glassCard}>

              {/* Toggle */}
              <View style={styles.toggleContainer}>

                {/* LOGIN TAB */}
                <TouchableOpacity
                  style={styles.toggleWrapper}
                  onPress={() => navigation.replace("Login_Student")}
                  activeOpacity={0.8}
                >
                  {activeTab === 'login' ? (
                    <LinearGradient
                      colors={['#C281FF', '#5623CD']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.activeToggle}
                    >
                      <Text style={[styles.toggleText, { color: '#fff' }]}>
                        Login
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.inactiveToggle}>
                      <Text style={[styles.toggleText, { color: '#000' }]}>
                        Login
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* SIGNUP TAB */}
                <TouchableOpacity
                  style={styles.toggleWrapper}
                  onPress={() => setActiveTab('Signup_Student')}
                  activeOpacity={0.8}
                >
                  {activeTab === 'Signup_Student' ? (
                    <LinearGradient
                      colors={['#C281FF', '#5623CD']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.activeToggle}
                    >
                      <Text style={[styles.toggleText, { color: '#fff' }]}>
                        Signup
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.inactiveToggle}>
                      <Text style={[styles.toggleText, { color: '#000' }]}>
                        Signup
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
              {/* Username */}
              <TextInput
                placeholder="Email"
                placeholderTextColor="rgba(255,255,255,0.6)"
                style={styles.input}
                value={form.username}
                onChangeText={(text) =>
                  setForm(prev => ({ ...prev, username: text }))
                }
              />

              {/* Password */}
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Password"
                  value={form.password}
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry={!showPassword}
                  style={styles.passwordInput}
                  onChangeText={(text) =>
                    setForm(prev => ({ ...prev, password: text }))
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  placeholderTextColor="rgba(255,255,255,0.6)"
                  secureTextEntry={!showConfirmPassword}
                  style={styles.passwordInput}
                  onChangeText={(text) =>
                    setForm(prev => ({ ...prev, confirmPassword: text }))
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#ffffff"
                  />
                </TouchableOpacity>
              </View>

              {/* Signup Button */}
              <TouchableOpacity
                style={{ marginTop: 25 }}
                activeOpacity={0.8}
                onPress={handleSignup}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#C281FF', '#5623CD']}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginText}>
                    {loading ? 'Please wait...' : 'Signup'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

            </BlurView>
          </View>

        </ScrollView>
      </AppBackgroundStudent>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    marginTop: 50,
  },

  logo: {
    fontSize: 15,
    fontFamily: 'Times New Roman',
    marginBottom: 50,
    color: '#fff',
  },
  image: {
    width: 294,
    height: 294,
    marginBottom: 30,
    alignSelf: 'center',
  },
  glassCard: {
    borderRadius: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 30,              // fully rounded
    marginBottom: 25,
    padding: 3,
  },

  toggleWrapper: {
    flex: 1,
  },

  activeToggle: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },

  inactiveToggle: {
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
  },

  toggleText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 16
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'DMMono-Regular',
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    width: 150,
    alignSelf: 'center',
  },
  loginText: {
    color: '#fff',
    fontFamily: 'DMMono-Regular',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: '#fff',
    fontFamily: 'DMMono-Regular',
  },
  eyeIcon: {
    paddingLeft: 10,
  },
});