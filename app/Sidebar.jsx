import { useRouter } from "expo-router";
import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Avatar, List, IconButton } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Sidebar = ({ setISideBar, userData }) => {
  const router = useRouter();
  const [userDetail, setUserDetail] = useState([]);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const userDetailString = await AsyncStorage.getItem("userToken");
        if (userDetailString) {
          setUserDetail(JSON.parse(userDetailString));
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetail();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userDetail");
            setISideBar(false);
            router.push("login");
          } catch (error) {
            console.error("Error logging out:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <IconButton
          icon="close"
          size={24}
          onPress={() => setISideBar(false)}
          style={styles.closeButton}
        />
        <View style={styles.profileSection}>
          <Avatar.Image
            size={80}
            source={
              userData?.profileImage
                ? { uri: userData.profileImage }
                : require("../assets/images/ghar_l.png")
            }
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userDetail[0]?.FullName}</Text>
            <Text style={styles.memberType}>{userDetail[0]?.MemberType}</Text>
          </View>
        </View>
        <List.Section>
          <List.Item
            onPress={() => {
              setISideBar(false);
              router.push("profileScreen");
            }}
            title={<Text style={styles.listTitle}>Profile</Text>}
            left={() => (
              <Icon name="account" size={24} style={styles.listIcon} />
            )}
            right={() => (
              <Icon name="chevron-right" size={24} style={styles.listIcon} />
            )}
            style={styles.listItem}
          />
          <List.Item
            onPress={() => {
              setISideBar(false);
              router.push("AddProperty");
              //router.push("faltu");
            }}
            title={<Text style={styles.listTitle}>Post Property Ad</Text>}
            left={() => (
              <Icon name="plus-circle" size={24} style={styles.listIcon} />
            )} // Using add icon
            right={() => (
              <Icon name="chevron-right" size={24} style={styles.listIcon} />
            )}
            style={styles.listItem}
          />
          <List.Item
          onPress={() => {
            router.push({
              pathname: 'ViewAds',
              params: {
                pageName: 'Residentail', 
              },
            });
          }}
            // onPress={() => {
            //   setISideBar(false);
            //   router.push({
            //     pathname: "ViewAds",
            //     params: {
            //       pageName: 'Residential', 
            //     },
            //   });
            // }}
            title={<Text style={styles.listTitle}>View Ads</Text>}
            left={() => <Icon name="eye" size={24} style={styles.listIcon} />} 
            right={() => (
              <Icon name="chevron-right" size={24} style={styles.listIcon} />
            )}
            style={styles.listItem}
          />
          <List.Item
            onPress={handleLogout}
            title={<Text style={styles.listTitle}>Logout</Text>}
            left={() => (
              <Icon name="logout" size={24} style={styles.listIcon} />
            )}
            style={styles.listItem}
          />
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#006666",
    width: 300,
    paddingTop: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  memberType: {
    fontSize: 16,
    color: "#fff",
  },
  listTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  listIcon: {
    color: "#FFD700",
    marginLeft: 10,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
});

export default Sidebar;
