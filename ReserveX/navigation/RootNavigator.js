import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StudentNavigator from "./StudentNavigator";
import ProfileScreen from "../screens/student/ProfileScreen";
import NotificationScreen from "../screens/student/NotificationScreen";
import EditProfileScreen from "../screens/student/EditProfileScreen";

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Tabs" component={StudentNavigator} />
            <RootStack.Screen name="Profile" component={ProfileScreen} />
            <RootStack.Screen name="Notifications" component={NotificationScreen} />
            <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
        </RootStack.Navigator>
    );
}