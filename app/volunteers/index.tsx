import { StyleSheet, Text, View, useColorScheme, Image } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { FlatList } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { volunteers } from '@/constants/data'
import { Stack } from 'expo-router'
const VolunteersPage = () => {
    const colorScheme = useColorScheme()
  return (
    <>
    <Stack.Screen options={{headerTitle: "Leaders"}} />
    <View style={{flex:1}}>
     <ThemedText style={styles.volunteerTitle}>Leaders</ThemedText>
        <FlatList
          data={volunteers}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.volunteerCard,
                {
                  borderColor:
                    colorScheme === "dark"
                      ? Colors.dark.border
                      : Colors.light.border,
                },
              ]}
            >
              <ThemedView style={styles.imageContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <Image
                    source={item?.profileImage}
                    style={styles.image}
                  />
                  <View>
                    <ThemedText>{item.name}</ThemedText>
                    <ThemedView
                      style={{ alignItems: "center", flexDirection: "row" }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color={"gray"}
                      />
                      <ThemedText style={{ fontSize: 12, color: "gray" }}>
                        {item.address}
                      </ThemedText>
                    </ThemedView>
                  </View>
                </View>
                <ThemedText
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    color: Colors.light.tint,
                  }}
                >
                  {item.bloodGroup}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.info}>
                <ThemedText>Phone: {item.phone}</ThemedText>
                <ThemedText>Email: {item.email}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          ListFooterComponent={
            <ThemedText style={{ textAlign: "center", paddingBottom: 200 }}>
              
            </ThemedText>
          }
          ListEmptyComponent={
            <ThemedText>
              No  volunteers found
            </ThemedText>
          }
        />
    </View>
    </>
  )
}

export default VolunteersPage

const styles = StyleSheet.create({
    volunteerTitle:{
        fontSize:20,
        fontWeight:'bold',
        marginHorizontal:10,
        marginTop:10
    },
    volunteerCard:{
        padding:10,
        borderRadius:5,
        marginHorizontal:10,
        marginVertical:5
    },
    imageContainer:{
        flexDirection:'row',
        alignItems:'center',
        gap:10
    },
    image:{
        width:50,
        height:50,
        borderRadius:25
    },
    info:{
        marginTop:10
    }

})