import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Sign in" component={SignInScreen} />
            <Stack.Screen name="Sign up" component={SignUpScreen} />
        </Stack.Navigator>
    );
}