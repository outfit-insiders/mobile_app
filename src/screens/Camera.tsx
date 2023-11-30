import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from "../initSupabase";

export default function App() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = useState(null);

  function toggleCameraType() {
    setType((current) =>
      current === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setCapturedImage(photo);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setCapturedImage(result);
    }
  };

  const uploadToSupabase = async () => {
    if (!capturedImage) return;

    try {
      // Upload image to Supabase Storage
      const { data, error } = await supabase.storage
        .from('posts') // Replace with your actual storage bucket name
        .upload(`images/${Date.now()}`, capturedImage.uri);

      if (error) {
        console.error('Error uploading image:', error);
        return;
      }

      // Get the user UUID from AsyncStorage
      const userString = await AsyncStorage.getItem("user");
      if (!userString) {
        console.error('User data not found in AsyncStorage');
        return;
      }

      const user = JSON.parse(userString);
      const userUuid = user?.uuid; // Replace with the actual property name

      if (!userUuid) {
        console.error('User UUID not found in AsyncStorage');
        return;
      }

      // Insert a new row in the "posts" table
      const description = 'Your image description'; // Replace with the actual image description
      // Insert a new row in the "posts" table
     const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert([
          {
            user_uuid: userUuid,
            likes: 0,
            description: description,
            image_bucket: storageData.Key, // Use the URL returned by the storage upload
          },
        ])
        .select(); 


      if (postError) {
        console.error('Error inserting post:', postError);
        return;
      }

      console.log('Image uploaded and post inserted:', postData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 1 }}
        type={cameraType}
        ref={(ref) => {
          cameraRef = ref;
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            margin: 20,
          }}
        >
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={takePicture}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }}
            onPress={pickImage}
          >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Pick Image</Text>
          </TouchableOpacity>
        </View>
      </Camera>

      {capturedImage && (
        <View style={{ flex: 1 }}>
          <Image source={{ uri: capturedImage.uri }} style={{ flex: 1 }} />
          <TouchableOpacity onPress={uploadToSupabase}>
            <Text>Upload to Supabase</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

