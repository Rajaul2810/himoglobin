// Start of Selection
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Text,
  FlatList,
} from "react-native";
import React, { useEffect } from "react";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import DonorComponent from "@/components/DonorComponent";
import Campaing from "@/components/Campaing";
import Volunteer from "@/components/User/Volunteer";
import Initiator from "@/components/User/Initiator";
import ApplyVolunteerCard from "@/components/utilsComponent/ApplyVolunteerCard";
import ContactCard from "@/components/utilsComponent/ContactCard";
import { useQuery } from "@tanstack/react-query";
import  apiServices  from "@/utils/apiServices";
import { getUserType } from "@/hooks/authUtils";
import useAuthStore from "@/store/authStore";
import Hero from "@/components/Hero";


export default function HomeScreen() {
  const {setUser} = useAuthStore((state: any) => state);
  const { getUserById } = apiServices;
  const userType  = getUserType();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userInfo"],
    queryFn: () => getUserById(userType?.id),
  });
  
  useEffect(() => {
    if (data) {
      setUser(data?.data);
    }
  }, [data]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.donorContainer}>
        <Header />
      </ThemedView>
      <FlatList
        ListHeaderComponent={
          <>
            <Hero />
            <DonorComponent />
            <Campaing />
            <Initiator />
          </>
        }
        ListFooterComponent={ 
          <>
            <Volunteer />
            <ApplyVolunteerCard />
            {/* <ContactCard /> */}
          </>
        }
        data={[]} // Empty data since components manage their own lists
        keyExtractor={(_, index) => `empty-${index}`}
        renderItem={null}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  donorContainer: {
    marginBottom: 5,
  },
});
