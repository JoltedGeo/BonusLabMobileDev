import { ActivityIndicator, View } from "react-native";
import AuthNavigator from "../navigation/AuthNavigator";
import AppNavigator from "../navigation/AppNavigation";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/MainColors";

export default function App() {
  const { user, loading } = useAuth();

  /* If the authentication state is still being determined, show a loading indicator. */

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return ( user ? <AppNavigator /> : <AuthNavigator />
  )
}