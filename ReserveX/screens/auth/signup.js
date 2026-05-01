import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import AppBackgroundStudent from "../../layouts/AppBackgroundStudents";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Logo from "../../assets/ReserveX.svg";

export default function SignupScreen({ switchToLogin }) {

  const [form, setForm] = useState({
    sapId: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (loading) return;

    const { sapId, username, email, password, confirmPassword } = form;

    if (!sapId || !username || !email || !password || !confirmPassword) {
      return Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill all fields',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Toast.show({
        type: 'error',
        text1: 'Invalid Email',
      });
    }

    try {
      setLoading(true);

      const res = await fetch(
        'https://reservex.onrender.com/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: username.trim(),
            email: email.trim(),
            password,
            role: 'STUDENT',
            idNumber: sapId.trim(),
          })
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || 'Signup failed');

      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'You can now login',
      });

      //  auto switch
      switchToLogin?.();

    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: err.message,
      });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppBackgroundStudent>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={80}
        enableAutomaticScroll={true}
        showsVerticalScrollIndicator={false}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <View style={styles.container}>

          {/* Logo */}
          <Logo width={120} height={50} style={styles.logo} />

          <Image
            source={require('../../assets/signup_img.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <BlurView intensity={40} tint="dark" style={styles.glassCard}>

            {/* Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={styles.inactiveToggle}
                onPress={switchToLogin}
              >
                <Text style={styles.inactiveText}>Login</Text>
              </TouchableOpacity>

              <View style={styles.activeToggle}>
                <Text style={styles.activeText}>Signup</Text>
              </View>
            </View>


            {/* Username */}
            <TextInput
              placeholder="SAP ID"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              value={form.sapId}
              onChangeText={(text) =>
                setForm(prev => ({ ...prev, sapId: text }))
              }
            />

            <TextInput
              placeholder="Username"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              value={form.username}
              onChangeText={(text) =>
                setForm(prev => ({ ...prev, username: text }))
              }
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              style={styles.input}
              value={form.email}
              onChangeText={(text) =>
                setForm(prev => ({ ...prev, email: text }))
              }
              keyboardType="email-address"
              autoCapitalize="none"
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
              style={styles.SignupButtonWrapper}
              onPress={handleSignup}
              disabled={loading}
            >
              <View style={styles.SignupButton}>
                <Text style={styles.SignupText}>
                  {loading ? 'Please wait...' : 'Signup'}
                </Text>
              </View>
            </TouchableOpacity>

          </BlurView>
        </View>

      </KeyboardAwareScrollView>
    </AppBackgroundStudent >

  );
}

const styles = StyleSheet.create({

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 80,
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
    backgroundColor: '#004D57',
    borderRadius: 30,
    marginBottom: 25,
    padding: 3,
  },

  activeToggle: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#81ECFF',
    borderRadius: 25,
  },

  inactiveToggle: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },

  activeText: {
    color: '#000',
    fontFamily: 'DMMono-Regular',
    fontSize: 16,
  },

  inactiveText: {
    color: '#fff',
    fontFamily: 'DMMono-Regular',
    fontSize: 16,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingVertical: 12,
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'DMMono-Regular',
  },
  SignupButtonWrapper: {
    marginTop: 25,
    alignItems: 'center',
    marginBottom: 20,
  },

  SignupButton: {
    paddingVertical: 14,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    backgroundColor: '#81ECFF',
  },

  SignupText: {
    fontFamily: 'DMMono-Regular',
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
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