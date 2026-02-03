
import themeColors from "@/theme/themeColors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { usePathname } from "expo-router"; // 👈 NEW
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { useRef } from "react";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

const TabArr = [
  { route: "match", label: "Match", icon: "heart-outline" },
  { route: "hotspots", label: "Hotspots", icon: "location-outline" },
  { route: "history", label: "History", icon: "time-outline" },
  { route: "profile", label: "Profile", icon: "person-outline" },
];

export default function TabLayout() {
  const pathname = usePathname();
  const currentTab = pathname.split("/")[1];

  const TabButton = ({ item, isActive }) => {
    const viewRef = useRef(null);

    return (
      <Animatable.View
        ref={viewRef}
        style={[
          styles.tabButton,
          {
            backgroundColor: isActive
              ? themeColors.warmYellow
              : themeColors.white,
            overflow: "hidden",
            width: isActive ? scale(100) : scale(40),
          },
        ]}
      >
        <Ionicons name={item.icon} size={20} color={themeColors.black} />
        {isActive && (
          <Animatable.Text
            animation="fadeIn"
            duration={1000}
            style={styles.label}
          >
            {item.label}
          </Animatable.Text>
        )}
      </Animatable.View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.white }}>
      <StatusBar barStyle="dark-content" />
      <Tabs initialRouteName="match">
        <TabSlot />
        <TabList style={styles.tabBar}>
          {TabArr.map((item) => {
            const isActive = currentTab === item.route;
            return (
              <TabTrigger
                key={item.route}
                name={item.route}
                href={item.route}
                style={styles.tabWrapper}
              >
                <TabButton item={item} isActive={isActive} />
              </TabTrigger>
            );
          })}
        </TabList>
      </Tabs>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: verticalScale(10),
    backgroundColor: themeColors.darkCharcoal,
    borderRadius: scale(27.5),
    height: scale(55),
    width: width * 0.9,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    padding: 0,
    margin: 0,
  },
  tabWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  tabButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(20),
    height: scale(40),
    width: scale(40),
  },
  label: {
    color: themeColors.black,
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
  },
});

