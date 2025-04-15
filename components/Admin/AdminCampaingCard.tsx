import { StyleSheet, Text, View, Image, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { useRouter } from "expo-router";
interface Campaign {
  id: string;
  name: string;
  address: string;
  bannerUrl: string;
  institute: string | null;
  startDate: string;
  endDate: string;
  volunteerList: { id: string; name: string }[];
}

interface AdminCampaingCardProps {
  item: Campaign;
  onEdit: () => void;
  onDelete: () => void;
}

const AdminCampaingCard = ({ item, onEdit, onDelete }: AdminCampaingCardProps) => {
  const colorTheme = useColorScheme();
  const router = useRouter();
  return (
    <View>
      <ThemedView style={styles.container}>
        <View style={styles.content}>
          <Image 
            source={{ uri: 'https://mehrabmahi21-001-site1.qtempurl.com/' + item.bannerUrl }} 
            style={styles.image} 
          />
          <View style={{width: '65%'}}>
            <ThemedText style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</ThemedText>
            <ThemedText numberOfLines={1} ellipsizeMode="tail">{item.institute || 'No Institution'}</ThemedText>
            <View style={styles.dateContainer}>
              <ThemedText style={styles.dateText}>
                Start: {new Date(item.startDate).toLocaleDateString()}
              </ThemedText>
              <ThemedText style={styles.dateText}>End: {new Date(item.endDate).toLocaleDateString()}</ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButtonMedia} onPress={() => router.push(`/admin/manage-media?campaignId=${item.id}`)}>
            <Text style={styles.actionButtonText}>Media</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonEdit} onPress={onEdit}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButtonDelete} onPress={onDelete}>
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </View>
  );
};

export default AdminCampaingCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "lightgray",
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
  },
  image: {
    width: 120,
    height: "100%",
    borderRadius: 5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent:'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    flex: 1,
  },
  actionButtonEdit: {
    backgroundColor: "green",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  actionButtonDelete: {
    backgroundColor: "red",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 10,
  },
  dateText: {
    fontSize: 12,
    color: "gray",
  },
  actionButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButtonMedia: {
    backgroundColor: "teal",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
});
