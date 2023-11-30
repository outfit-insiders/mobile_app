import React from "react";
import { View, Linking, ScrollView, Image } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
  SectionImage,
  Avatar,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";


export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {

  const { isDarkmode, setTheme } = useTheme();
  
  const data = [
    { key: '1', imageUrl: 'https://sothebys-com.brightspotcdn.com/74/34/543925cf4281ba9fe0b774e76c85/gettyimages-1316606580.jpg', content: 'This is a Section with an image' },
    { key: '2', imageUrl: 'https://sothebys-com.brightspotcdn.com/74/34/543925cf4281ba9fe0b774e76c85/gettyimages-1316606580.jpg', content: 'This is a Section with an image' },
    // Add more data as needed
  ]; 

  const Section = ({ imageUrl, content }) => (
    <View style={{ flex: 1, margin: 10 }}>
      <Image source={{ uri: imageUrl }} style={{ width: 100, height: 100, resizeMode: 'cover' }} />
      <Text>{content}</Text>
    </View>
  );


  return (
  <Layout>
   <FlashList
      data={data}
      renderItem={({ item }) => <Section imageUrl={item.imageUrl} content={item.content} />}
      keyExtractor={(item) => item.key}
      estimatedItemSize={135}
      numColumns={2} // Specify the number of columns
    /> 
    </Layout>
  );
}
