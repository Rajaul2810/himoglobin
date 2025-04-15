import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  useColorScheme,
} from "react-native";
import React from "react";
import apiServices from "@/utils/apiServices";
import { useQuery } from "@tanstack/react-query";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { formatDate } from "@/utils/formatDate";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import LoadingComponent from "@/components/utilsComponent/Loading";
import ErrorComponent from "@/components/utilsComponent/Error";
import { Stack } from "expo-router";
const NoticePage = () => {
  const colorScheme = useColorScheme()
  const { getAllNotice } = apiServices;

  const { data, isLoading, error,refetch } = useQuery({
    queryKey: ["getAllNotice"],
    queryFn: () => getAllNotice(1,10),
    refetchOnReconnect: true,
  });

  if(isLoading){
    <LoadingComponent/>
  }
  if(error){
    <ErrorComponent error={error} refetch={refetch} />
  }


  return (
    <>
    <Stack.Screen options={{headerTitle: "Notice"}} />
    <FlatList
      data={data?.data}
      renderItem={({ item }) => (
        <ThemedView
          style={{
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colorScheme=== "dark" ? Colors.dark.border :Colors.light.border,
          }}
        >
          <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>
            {item?.name}
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: "gray" }}>
            {formatDate(item?.publishDate)}
          </ThemedText>
          {item?.fileUrls?.map((url: string, index: number) => (
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center", justifyContent:'center', gap: 5, borderWidth:1, borderColor:'gray',borderRadius:6, padding:3 }}
              key={index}
              onPress={() =>
                Linking.openURL(
                  "https://mehrabmahi-001-site1.qtempurl.com/" + url
                )
              }
            >
              <ThemedText style={{ fontSize: 12, color: "gray" }}>
                Details
              </ThemedText>
              <Ionicons name="download-outline" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}
      keyExtractor={(item) => item?.id}
      style={{ margin: 10 }}
      ListEmptyComponent={
        <ThemedText style={{ textAlign: "center", padding: 10 }}>
          No notice found
        </ThemedText>
      }
    />
    </>
  );
};

export default NoticePage;

const styles = StyleSheet.create({});
