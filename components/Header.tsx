import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";
import { getUserType } from "@/hooks/authUtils";
import { useShallow } from "zustand/react/shallow";
import { AntDesign } from "@expo/vector-icons";
const Header = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { user, token } = useAuthStore(useShallow((state: any) => state));

  // Call getUserType at the top level
  const userType = getUserType();
  console.log("userType", userType);

  const handleUserIconPress = () => {
    if (token && userType) {
      router.push("/user/update");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 5,
          borderRadius: 100,
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
        }}
        onPress={() => {
          handleUserIconPress();
        }}
      >
        <IconSymbol
          name="person.fill"
          size={24}
          color={Colors[colorScheme ?? "light"].icon}
        />
        <Text style={{ fontSize: 12, color: "blue" }}>
          {userType ? "Profile" : "Login"}
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
        <TouchableOpacity
          onPress={() => {
            router.push("/notice");
          }}
        >
          <AntDesign name="notification" size={20} color={"gray"} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push("/contact");
          }}
        >
          <AntDesign name="message1" size={20} color={"gray"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
});
