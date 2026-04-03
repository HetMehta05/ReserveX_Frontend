import React, { use } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../../components/Header";
import AppBackgroundCommittee from "../../../layouts/AppBackgroundCommittee";


export default function CommitteeEventsScreen() {
  const navigation = useNavigation();
  const dummy = Array.from({ length: 6 });

  return (
    <AppBackgroundCommittee>
      <View style={styles.container}>

        {/* Header */}
        <Header currentScreen="Events" />

        {/* Title */}
        <Text style={styles.title}>My Events</Text>

        {/* Grid */}
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {dummy.map((_, index) => (
            <View key={index} style={styles.cardContainer}>

              {/* Event Card */}
              <View style={styles.card} />

              {/* Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn}>
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("CreateEvent")}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>

      </View>
    </AppBackgroundCommittee>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 60,
  },

  title: {
    color: "#fff",
    fontSize: 16,
    alignSelf: "center",
    marginBottom: 20,
    letterSpacing: 1,
  },

  /* GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 120,
  },

  cardContainer: {
    width: "30%",
    marginBottom: 25,
  },

  /* CARD */
  card: {
    height: 150,
    borderRadius: 10,
    backgroundColor: "#0f3f459b",
    elevation: 6,
  },

  /* BUTTON ROW */
  buttonRow: {
    marginTop: 8,
    gap: 6,
  },

  btn: {
    backgroundColor: "#00ffdd",
    borderRadius: 14,
    paddingVertical: 4,
    alignItems: "center",
  },

  btnText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#000",
  },

  /* FLOATING BUTTON */
  fab: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",

    width: 55,
    height: 55,
    borderRadius: 30,

    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});