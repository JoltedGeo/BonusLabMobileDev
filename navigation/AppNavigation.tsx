import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployeeInfoScreen from "../screens/EmployeeInfoScreen";
import { colors } from "../theme/MainColors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "700",
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="Employee info" component={EmployeeInfoScreen} />
    </Stack.Navigator>
  );
}