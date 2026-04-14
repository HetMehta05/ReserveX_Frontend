import React, { useState } from 'react';
import AppBackgroundStudent from "../../layouts/AppBackgroundStudents";

import LoginScreen from './StudentLogin';
import SignupScreen from './signup';

export default function AuthScreen() {
    const [mode, setMode] = useState('login');

    const switchToLogin = () => setMode('login');
    const switchToSignup = () => setMode('signup');

    return (
        <AppBackgroundStudent>
            {mode === 'login' ? (
                <LoginScreen switchToSignup={switchToSignup} />
            ) : (
                <SignupScreen switchToLogin={switchToLogin} />
            )}
        </AppBackgroundStudent>
    );
}