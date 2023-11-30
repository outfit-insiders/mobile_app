import React, { useState } from "react";
import { Linking, TextInput, View } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Section,
  SectionContent,
  Text,
  Button,
  Avatar,
} from "react-native-rapi-ui";
import { supabase } from "../initSupabase";
import { getUser } from "./utils/Utilities";

export default function ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, "MainTabs">) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Aditya Chandraker");
  const [avatarUri, setAvatarUri] = useState(
    "https://www.cabq.gov/artsculture/biopark/news/10-cool-facts-about-penguins/@@images/1a36b305-412d-405e-a38b-0947ce6709ba.jpeg"
  );

  const user = getUser();

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ display: "flex", flexDirection: "row" }}>
          {isEditing ? (
            <>
              <TextInput value={avatarUri} onChangeText={setAvatarUri} />
              <TextInput value={name} onChangeText={setName} />
            </>
          ) : (
            <>
              <Avatar source={{ uri: avatarUri }} size="xl" shape="round" />
              <Text fontWeight="bold" style={{ margin: 20 }}>
                {name}
              </Text>
            </>
          )}
          <Button onPress={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save" : "Edit"}
          </Button>
        </View>

        <Section style={{ marginTop: 20 }}>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              These UI components provided by Rapi UI
            </Text>
            <Button
              style={{ marginTop: 10 }}
              text="Rapi UI Documentation"
              status="info"
              onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
            />
            <Button
              text="Go to second screen"
              onPress={() => {
                navigation.navigate("SecondScreen");
              }}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              status="danger"
              text="Logout"
              onPress={async () => {
                const { error } = await supabase.auth.signOut();
                if (!error) {
                  alert("Signed out!");
                }
                if (error) {
                  alert(error.message);
                }
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
