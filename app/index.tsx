import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
const { width, height } = Dimensions.get('window');

const StartScreen = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/darkLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bottomContent}>
          <ThemedText
            type="subtitle"
            style={styles.subtitle}
          >
            মানবতার শ্রেষ্ঠ দান, রক্ত দিয়ে বাচাই প্রাণ
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.loginButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContent: {
    width: '100%',
    alignItems: 'center',
    marginBottom: height * 0.05
  },
  logo: {
    width: Math.min(width * 0.5, 200),
    height: Math.min(width * 0.5, 200),
  },
  subtitle: {
    textAlign: "center",
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.04,
    fontSize: Math.min(width * 0.05, 24)
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
    padding: Math.min(width * 0.04, 15),
    borderRadius: 8,
    width: '90%',
    maxWidth: 400,
  },
  loginButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: "bold",
  },
});
