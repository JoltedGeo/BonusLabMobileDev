import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import EmployeeInfoScreen from "../screens/EmployeeInfoScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Sign in" component={SignInScreen} />
            <Stack.Screen name="Sign up" component={SignUpScreen} />
            <Stack.Screen name="Employee info" component={EmployeeInfoScreen} />
        </Stack.Navigator>
    );
}