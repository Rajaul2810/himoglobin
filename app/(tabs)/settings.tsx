import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuthStore from "@/store/authStore";
import { useShallow } from "zustand/react/shallow";
import { getUserType } from "@/hooks/authUtils";
const Settings = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Properly extract values from the auth store
  const { logout, user, token } = useAuthStore(
    useShallow((state: any) => ({
      logout: state.logout,
      user: state.user,
      token: state.token
    }))
  );

  const userTypeInfo = getUserType();
  const id = userTypeInfo?.id;
  
  // Handle logout with state updates
  const handleLogout = () => {
    logout();
    // Reset all auth-related states
    setIsAdmin(false);
    setIsVolunteer(false);
    setIsLoggedIn(false);
  };
  
  useEffect(() => {
    // Check user type and token to set appropriate states
    if (user && token) {
      setIsLoggedIn(true);
      setIsAdmin(user.userType === "Admin");
      setIsVolunteer(user.userType === "Volunteer");
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsVolunteer(false);
    }
  }, [user, token]);
  
  
  const authSettings = [
    {
      title: "Login",
      icon: <MaterialIcons name="login" size={24} color={Colors.light.tint} />,
      onPress: () => router.push("/auth/login"),
    },
    {
      title: "Register",
      icon: (
        <MaterialIcons name="person-add" size={24} color={Colors.light.tint} />
      ),
      onPress: () => router.push("/auth/register"),
    },
    {
      title: "Notifications",
      icon: (
        <Ionicons
          name="notifications-outline"
          size={24}
          color={Colors.light.tint}
        />
      ),
      onPress: () => router.push("/notice"),
    },
    {
      title: "Privacy & Security",
      icon: (
        <MaterialIcons name="security" size={24} color={Colors.light.tint} />
      ),
      onPress: () => {},
    },
  ];

  const commonSettings = [
    {
      title: "Update Profile",
      icon: (
        <Ionicons name="person-outline" size={24} color={Colors.light.tint} />
      ),
      onPress: () => router.push("/user/update"),
    },
    {
      title: "Notices",
      icon: (
        <Ionicons
          name="notifications-outline"
          size={24}
          color={Colors.light.tint}
        />
      ),
      onPress: () => router.push("/notice"),
    },
    {
      title: "Profile",
      icon: <MaterialIcons name="person" size={24} color={Colors.light.tint} />,
      onPress: () => router.push({pathname: "/user/[id]", params: {id: id}}),
    },
    {
      title: "Download Report",
      icon: <MaterialIcons name="person" size={24} color={Colors.light.tint} />,
      onPress: () => router.push("/user/download-report"),
    },
    {
      title: "Privacy & Security",
      icon: (
        <MaterialIcons name="security" size={24} color={Colors.light.tint} />
      ),
      onPress: () => {},
    },
    {
      title: "Delete Account",
      icon: <MaterialIcons name="delete" size={24} color={Colors.light.tint} />,
      onPress: () => {},
    },
    {
      title: "Logout",
      icon: <MaterialIcons name="logout" size={24} color={Colors.light.tint} />,
      onPress: () => handleLogout(),
    },
  ];

  const VolunteerSettings = [
    {
      title: "Download ID Card",
      icon: <MaterialIcons name="person" size={24} color={Colors.light.tint} />,
      onPress: () => router.push("/volunteers/download-id"),
    },
    {
      title: "Permitted Campaign",
      icon: <MaterialIcons name="campaign" size={24} color={Colors.light.tint} />,
      onPress: () => router.push("/volunteers/permitted-campaign"),
    },
    {
      title: "Donor List",
      icon: <MaterialIcons name="person" size={24} color={Colors.light.tint} />,
      onPress: () => router.push("/volunteers/donor-list"),
    },
    
  ];

  const adminSettings = [
    {
      title: "Manage News",
      icon: (
        <MaterialIcons name="newspaper" size={24} color={Colors.light.tint} />
      ),
      onPress: () => router.push("/admin/manage-news"),
    },
    {
      title: "Manage Notices",
      icon: (
        <MaterialIcons
          name="announcement"
          size={24}
          color={Colors.light.tint}
        />
      ),
      onPress: () => router.push("/admin/manage-notice"),
    },
    {
      title: "Manage Campaigns",
      icon: (
        <FontAwesome5 name="campground" size={24} color={Colors.light.tint} />
      ),
      onPress: () => router.push("/admin/manage-campaing"),
    },
    {
      title: "Manage Leader",
      icon: <MaterialIcons name="people" size={24} color={Colors.light.tint} />,
      onPress: () => router.push("/admin/manage-volunteer"),
    },
    {
      title: "Manage Blood Donors",
      icon: (
        <MaterialIcons name="bloodtype" size={24} color={Colors.light.tint} />
      ),
      onPress: () => router.push("/admin/manage-donor"),
    },
    {
      title: "Manage Contacts",
      icon: (
        <MaterialIcons name="contact-page" size={24} color={Colors.light.tint} />
      ),
      onPress: () => router.push("/admin/manage-contact"),
    },

    {
      title: "Manage Admins",
      icon: <MaterialIcons name="people" size={24} color={Colors.light.tint} />,
      onPress: () => {router.push("/admin/manage-admin")},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 16 }}>
        <View style={styles.section}>
          {!isLoggedIn ? (
            <>
              <ThemedText style={styles.sectionTitle}>
                Authentication
              </ThemedText>
              {authSettings.map((setting, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.settingItem,{ marginBottom: 10, backgroundColor: 'white' }]}
                  onPress={setting.onPress}
                >
                  {setting.icon}
                  <ThemedText style={styles.settingText}>
                    {setting.title}
                  </ThemedText>
                  <Ionicons name="chevron-forward" size={24} color="gray" />
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <>
              <ThemedText style={styles.sectionTitle}>
                Account Settings
              </ThemedText>
              {commonSettings.map((setting, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.settingItem,{ marginBottom: 10, backgroundColor: 'white' }]}
                  onPress={setting.onPress}
                >
                  {setting.icon}
                  <ThemedText style={styles.settingText}>
                    {setting.title}
                  </ThemedText>
                  <Ionicons name="chevron-forward" size={24} color="gray" />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {isLoggedIn && isAdmin && (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle]}>Admin Controls</ThemedText>
            {adminSettings.map((setting, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.settingItem,{ marginBottom: 10, backgroundColor: 'white' }]}
                onPress={setting.onPress}
              >
                {setting.icon}
                <ThemedText style={styles.settingText}>
                  {setting.title}
                </ThemedText>
                <Ionicons name="chevron-forward" size={24} color="gray" />
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        {isLoggedIn && isVolunteer && (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle]}>Volunteer Controls</ThemedText>
            {VolunteerSettings.map((setting, index) => (
              <TouchableOpacity
                key={index} 
                style={[styles.settingItem,{ marginBottom: 10, backgroundColor: 'white' }]}
                onPress={setting.onPress}
              >
                {setting.icon}
                <ThemedText style={styles.settingText}>
                  {setting.title} 
                </ThemedText>
                <Ionicons name="chevron-forward" size={24} color="gray" />
              </TouchableOpacity>
            ))}
          </View>
        )}        

      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
    borderRadius: 5,
    padding: 10,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});
