import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  useColorScheme,
  Dimensions,
} from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";
import { lastBloodDonation } from "@/utils/lastBloodDonation";

const UserCard = ({ user }: { user: any }) => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { token } = useAuthStore((state: any) => state);

  const handleCall = (phoneNumber: string) => {
    if (token) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert(
        "Please login to call the donor",
        "You need to be logged in to contact donors",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => {
              router.push("/auth/login");
            },
          },
        ]
      );
    }
  };

  return (
    <ThemedView
      style={[
        styles.donorCard,
        {
          borderColor:
            colorScheme === "dark" ? Colors.dark.border : Colors.light.border,
        },
      ]}
    >
      <ThemedView style={styles.imageContainer}>
        <View style={styles.userInfoContainer1}>
          <View style={styles.userInfoContainer}>
            <Image
              source={
                user?.imageUrl
                  ? {
                      uri:
                        "https://mehrabmahi21-001-site1.qtempurl.com/" +
                        user?.imageUrl,
                    }
                  : require("@/assets/images/user.jpg")
              }
              style={styles.image}
            />
            <View>
              <ThemedText style={styles.userName}>{user?.fullName}</ThemedText>
              <ThemedView>
                <ThemedText style={styles.lastDonationText}>
                  Last Donation: {lastBloodDonation(user?.lastDonationTime)}{" "}
                  days ago
                </ThemedText>
              </ThemedView>
            </View>
          </View>
          <ThemedText style={styles.bloodGroupBadge}>
            {user?.bloodGroup}
          </ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.divider} />

      <ThemedView style={styles.info}>
        <ThemedText style={styles.infoText}>
          Number of Donation: {user?.bloodDonationCount}
        </ThemedText>
        <ThemedText style={styles.infoText}>
          Physical Complexity:{" "}
          {user?.physicalComplexity ? user?.physicalComplexity : "No"}
        </ThemedText>
        <ThemedText 
          style={[
            styles.infoText,
            {
              backgroundColor: user?.bloodDonationStatus === "Interested" ? "#e6f7e9" : "#fff9e6",
              color: user?.bloodDonationStatus === "Interested" ? "#2e7d32" : "#f57c00",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 4,
              alignSelf: "flex-start"
            }
          ]}
        >
          Donation Status: {user?.bloodDonationStatus}
        </ThemedText>

        <View style={styles.contactContainer}>
          {token ? (
            <ThemedText style={styles.infoText}>
              Contact: {user?.mobileNumber}
            </ThemedText>
          ) : (
            <ThemedText style={styles.infoText}>
              Contact:{" "}
              {user?.mobileNumber
                ? `${user?.mobileNumber.slice(0, 5)}${"x".repeat(6)}`
                : ""}
            </ThemedText>
          )}

          <TouchableOpacity
            onPress={() => handleCall(user?.mobileNumber)}
            style={styles.callButton}
          >
            <Ionicons name="call-outline" size={16} color={"white"} />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </ThemedView>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  donorCard: {
    width: Dimensions.get("window").width - 30,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
  },
  imageContainer: {
    marginBottom: 10,
  },
  userInfoContainer1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flex: 1,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  lastDonationText: {
    fontSize: 12,
    color: "gray",
  },
  bloodGroupBadge: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 5,
    borderRadius: 50,
    color: "white",
    backgroundColor: Colors.light.tint,
    minWidth: 35,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 10,
  },
  info: {
    gap: 5,
  },
  infoText: {
    fontSize: 13,
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.light.tint,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  callButtonText: {
    color: "white",
    fontWeight: "500",
  },
});
