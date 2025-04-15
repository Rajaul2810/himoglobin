import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import useAuthStore from "@/store/authStore";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Stack } from "expo-router";
interface UserData {
  fullName?: string;
  code?: string;
  gender?: string;
  dateOfBirth?: string;
  dob?: string;
  mobileNumber?: string;
  userType?: string;
  isActive?: boolean;
  bloodGroup?: string;
  address?: string;
  instituteName?: string;
  physicalComplexity?: boolean;
}

const DownloadIdCard = () => {
  const { user } = useAuthStore((state: any) => state);
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);
  console.log(userData);

  const shareIdCard = async () => {
    try {
      await Share.share({
        message:
          `Volunteer ID Card\n\n` +
          `Name: ${userData?.fullName || "Not available"}\n` +
          `ID: ${userData?.code || "Not available"}\n` +
          `Blood Group: ${userData?.bloodGroup || "Not available"}\n` +
          `Mobile: ${userData?.mobileNumber || "Not available"}\n` +
          `User Type: ${userData?.userType || "Not available"}\n` +
          `Status: ${userData?.isActive ? "Active" : "Inactive"}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading user data...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "Volunteer ID Card"}} />
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>Leader ID Card</ThemedText>
          <TouchableOpacity style={styles.shareButton} onPress={shareIdCard}>
            <MaterialIcons name="share" size={24} color={Colors.light.tint} />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.idCardContainer}>
          <ThemedView style={styles.idCardHeader}>
            <Image
              source={require("@/assets/images/icon.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <ThemedText style={styles.organizationName}>
              Blood Donation Organization
            </ThemedText>
            <ThemedText style={styles.cardTitle}>LEADER ID CARD</ThemedText>
          </ThemedView>

          <ThemedView style={styles.photoSection}>
            <View style={styles.photoPlaceholder}>
              <MaterialIcons name="person" size={60} color="#999" />
            </View>
          </ThemedView>

          <ThemedView style={styles.infoSection}>
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Name:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.fullName || "Not available"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>ID:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.code || "Not available"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Blood Group:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.bloodGroup || "Not available"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Mobile:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.mobileNumber || "Not available"}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Gender:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.gender || "Not available"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Institution:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.instituteName || "Not available"}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Address:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.address || "Not available"}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>
                Physical Complexity:
              </ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.physicalComplexity ? "Yes" : "No"}
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.statusSection}>
            <ThemedView
              style={[
                styles.statusBadge,
                userData.isActive ? styles.activeStatus : styles.inactiveStatus,
              ]}
            >
              <Text style={styles.statusText}>
                {userData.isActive ? "Active" : "Inactive"}
              </Text>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.downloadButton} onPress={shareIdCard}>
          <MaterialIcons name="file-download" size={24} color="#fff" />
          <Text style={styles.downloadButtonText}>Download ID Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </>
  );
};

export default DownloadIdCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  shareButton: {
    padding: 8,
  },
  idCardContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",

    backgroundColor: "#fff",
  },
  idCardHeader: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: Colors.light.tint,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  organizationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  photoSection: {
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  infoSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  statusSection: {
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeStatus: {
    backgroundColor: "#e6f7e6",
  },
  inactiveStatus: {
    backgroundColor: "#ffe6e6",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    padding: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
  qrCode: {
    width: 60,
    height: 60,
  },
  downloadButton: {
    backgroundColor: Colors.light.tint,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  downloadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});
