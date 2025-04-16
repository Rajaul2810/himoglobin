import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  useColorScheme,
  Dimensions,
  ScrollView,
  Linking,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import apiServices, { BACKEND_URL } from "@/utils/apiServices";
import LoadingComponent from "@/components/utilsComponent/Loading";
import ErrorComponent from "@/components/utilsComponent/Error";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
//import YoutubePlayer from 'react-native-youtube-iframe'

const Media = () => {
  const colorScheme = useColorScheme();
  const [tab, setTab] = useState<"image" | "video" | "news">("image");
  const [imagePageNo, setImagePageNo] = useState(1);
  const [imagePageSize, setImagePageSize] = useState(10);
  const [videoPageNo, setVideoPageNo] = useState(1);
  const [videoPageSize, setVideoPageSize] = useState(10);
  const [newsPageNo, setNewsPageNo] = useState(1);
  const [newsPageSize, setNewsPageSize] = useState(10);
  const [newsData, setNewsData] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [videoData, setVideoData] = useState([]);

  const {
    data: mediaData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["media"],
    queryFn: () =>
      apiServices.getAllMedia({
        imagePageNo: imagePageNo,
        imagePageSize: imagePageSize,
        videoPageNo: videoPageNo,
        videoPageSize: videoPageSize,
      }),
    refetchOnReconnect: true,
  });

  const {
    data: newsDatas,
    isLoading: isNewsLoading,
    isError: isNewsError,
    error: newsError,
    refetch: refetchNews,
  } = useQuery({
    queryKey: ["news"],
    queryFn: () => apiServices.getAllNews(newsPageNo, newsPageSize),
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (mediaData) {
      setImageData(mediaData?.data?.imageUrls || []);
      setVideoData(mediaData?.data?.videoUrls || []);
    }
    if (newsData) {
      setNewsData(newsDatas?.data || []);
    }
  }, [mediaData, newsDatas]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <ErrorComponent error={error} refetch={refetch} />;
  }

  const getYoutubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderImageItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <ThemedView style={styles.mediaCard}>
        <View style={styles.mediaContent}>
          <Image
            source={
              item
                ? { uri: `${BACKEND_URL}/${item}` }
                : require("@/assets/images/donation.jpg")
            }
            style={styles.mediaImage}
            resizeMode="cover"
          />
        </View>
        <ThemedText style={styles.mediaTitle} numberOfLines={2}>
          {item.title || "Blood Donation Campaign"}
        </ThemedText>
      </ThemedView>
    );
  };

  const renderVideoItem = ({ item }: { item: any }) => {
    const videoId = item.mediaUrl ? getYoutubeVideoId(item.mediaUrl) : null;

    return (
      <ThemedView style={styles.videoCard}>
        <View style={styles.videoContainer}>
          {/* {videoId ? (
            <YoutubePlayer
              height={200}
              videoId={videoId}
            />
          ) : ( */}
          <View style={styles.placeholderVideo}>
            <Ionicons
              name="videocam"
              size={50}
              color={Colors[colorScheme === "dark" ? "dark" : "light"].tint}
            />
            <ThemedText>Video not available</ThemedText>
          </View>
          {/* )} */}
        </View>
        <ThemedText style={styles.videoTitle}>
          {item.title || "Blood Donation Campaign Video"}
        </ThemedText>
      </ThemedView>
    );
  };

  const renderNewsItem = ({ item }: { item: any }) => {
    return (
      <ThemedView style={styles.newsCard}>
        <Image
          source={require("@/assets/images/news.jpg")}
          style={styles.newsImage}
          resizeMode="cover"
        />
        <View style={styles.newsContent}>
          <ThemedText style={styles.newsTitle}>{item?.name}</ThemedText>
          <ThemedText style={styles.newsDate}>
            Date: {item?.createTime.split("T")[0]}
          </ThemedText>
          <ThemedText style={styles.newsDescription} numberOfLines={3}>
            {item?.description}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(item?.url)}
          style={{ alignSelf: "flex-end", padding: 5 }}
        >
          <ThemedText style={{ color: Colors.light.tint }}>
            Read More &gt; &gt;
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, tab === "image" && styles.tabButtonActive]}
          onPress={() => setTab("image")}
        >
          <ThemedText
            style={[
              styles.tabButtonText,
              tab === "image" && styles.tabButtonTextActive,
            ]}
          >
            Images
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "video" && styles.tabButtonActive]}
          onPress={() => setTab("video")}
        >
          <ThemedText
            style={[
              styles.tabButtonText,
              tab === "video" && styles.tabButtonTextActive,
            ]}
          >
            Videos
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, tab === "news" && styles.tabButtonActive]}
          onPress={() => setTab("news")}
        >
          <ThemedText
            style={[
              styles.tabButtonText,
              tab === "news" && styles.tabButtonTextActive,
            ]}
          >
            News
          </ThemedText>
        </TouchableOpacity>
      </View>

      {tab === "image" && (
        <FlatList
          data={imageData}
          renderItem={renderImageItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              No images found
            </ThemedText>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          onEndReached={() => {
            setImagePageNo(imagePageNo + 1);
          }}
          onEndReachedThreshold={0.5}
        />
      )}

      {tab === "video" && (
        <FlatList
          data={videoData}
          renderItem={renderVideoItem}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              No videos found
            </ThemedText>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          onEndReached={() => {
            setVideoPageNo(videoPageNo + 1);
          }}
          onEndReachedThreshold={0.5}
        />
      )}

      {tab === "news" && (
        <FlatList
          data={newsData}
          renderItem={renderNewsItem}
          keyExtractor={(item) => item.id?.toString() || item.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 20 }}>
              No news found
            </ThemedText>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      )}
    </SafeAreaView>
  );
};

export default Media;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: Colors.light.tint,
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabButtonTextActive: {
    color: Colors.light.tint,
    fontWeight: "700",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    gap: 15,
  },
  mediaCard: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  mediaContent: {
    width: "100%",
    height: 150,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  mediaTitle: {
    fontSize: 14,
    fontWeight: "500",
    padding: 8,
  },
  videoCard: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 15,
  },
  videoContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  placeholderVideo: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "500",
    padding: 12,
  },
  newsCard: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 15,
  },
  newsImage: {
    width: "100%",
    height: 180,
  },
  newsContent: {
    padding: 12,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  newsDate: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  newsDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
