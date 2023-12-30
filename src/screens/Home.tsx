import React, { useEffect, useState } from "react";
import { View, Linking, ScrollView, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  SectionContent,
  useTheme,
  themeColor,
  SectionImage,
  Avatar,
} from "react-native-rapi-ui";
import { FlashList } from "@shopify/flash-list";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) throw error;
      setPosts(data);
    } catch (error) {
      console.log("Error fetching posts:", error.message);
    }
  };

  const Section = ({ imageUrl, content }) => (
    <View style={{ flex: 1, margin: 10 }}>
      <Image
        source={{ uri: imageUrl }}
        style={{ width: "100%", minHeight: 300, height: "auto", resizeMode: "cover" }}
      />
      <Text>{content}</Text>
    </View>
  );

  return (
    <Layout>
      <FlashList
        data={posts}
        renderItem={({ item }) => (
          <Section imageUrl={item.image_bucket} content={item.description} />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={135}
        numColumns={2} // Specify the number of columns
      />
    </Layout>
  );
}