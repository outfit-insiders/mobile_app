import { supabase } from "../../initSupabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function uploadUserImage(file) {
  const user = await getUser();
  if (!user) {
    console.error("No user found");
    return;
  }

  const filePath = `${user.id}/${file.name}`;
  let { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.error(uploadError);
    return;
  }

  let { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: filePath })
    .eq("id", user.id);

  if (updateError) {
    console.error(updateError);
  }
}

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// toast -------------------------------------------------------

import React, { useEffect, useState, useRef } from "react";
import { Animated, Text, View } from "react-native";

let showToastFunc;

export const CustomToast = () => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  showToastFunc = (msg) => {
    setMessage(msg);
    setVisible(true);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (!visible) {
        setMessage("");
      }
    });

    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, fadeAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: "center",
        padding: 10,
        backgroundColor: "black",
      }}
    >
      <Text style={{ color: "white" }}>{message}</Text>
    </Animated.View>
  );
};

export const showToast = (message) => {
  showToastFunc(message);
};
