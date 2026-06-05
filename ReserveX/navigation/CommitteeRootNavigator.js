import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CommitteeStackNavigator from "./CommitteeNavigator";
import CommitteeProfileScreen from "../screens/committee/CommitteeProfile";
import { CommitteeNotification } from "../screens/committee/CommitteeNotification";


const RootStack = createNativeStackNavigator();

export default function CommitteeRootNavigator() {
    return (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Tabs" component={CommitteeStackNavigator} />
            <RootStack.Screen name="Profile" component={CommitteeProfileScreen} />
            <RootStack.Screen name="Notifications" component={CommitteeNotification} />
        </RootStack.Navigator>
    );
}