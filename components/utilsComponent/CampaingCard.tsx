import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";

const CampaingCard = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => router.push({pathname: "/campaing/[id]", params: {id: item?.id}})}> 
      <ThemedView style={styles.container}>
      <Image source={{ uri: `https://mehrabmahi21-001-site1.qtempurl.com/${item?.bannerUrl}` }} resizeMode="stretch" style={styles.bannerImage} />
      <ThemedView style={styles.contentContainer}>
        <ThemedText style={styles.title}>{item.name}</ThemedText>

        <View style={styles.infoRow}>
          <MaterialIcons
            name="location-on"
            size={20}
            color={Colors.light.tint}
          />
          <ThemedText style={styles.infoText}>{item?.address}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Ionicons
            name="school"
            size={20}
            color={Colors.light.tint}
          />
          <ThemedText style={styles.infoText}>{item?.institute}</ThemedText>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.infoRow}>
            <MaterialIcons name="event" size={20} color={Colors.light.tint} />
            <ThemedText style={styles.infoText}>
              Start: {item?.startDate?.split("T")[0]}
            </ThemedText>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons
              name="event-available"
              size={20}
              color={Colors.light.tint}
            />
            <ThemedText style={styles.infoText}>End: {item?.endDate?.split("T")[0]}</ThemedText>
          </View>
        </View>

        <View style={styles.volunteerContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color={Colors.light.tint} />
            <ThemedText style={styles.volunteerText}>
              {item?.volunteerList?.length} Volunteers
            </ThemedText>
            </View>
          </View>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default CampaingCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    margin: 10,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: Dimensions.get("window").width - 20,
  },
  bannerImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  contentContainer: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  dateContainer: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  volunteerContainer: {
    marginTop: 5,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  volunteerText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.tint,
  },
});
