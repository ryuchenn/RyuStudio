import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import useAuth from "@/hooks/useAuth";

export function useRequireLogin() {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();

  return (callback: () => void) => {
    if (isLoggedIn) {
      callback();
    } else {
      Alert.alert(
        "Login Required",
        "You need to be signed in to use this feature.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Sign In",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "Accounts" as never,
                    state: {
                      index: 0,
                      routes: [
                        {
                          name: "Signin" as never,
                        },
                      ],
                    },
                  },
                ],
              });
            },
          },
        ]
      );
    }
  };
}
