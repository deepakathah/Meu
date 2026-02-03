
import AnimateGif from "@/components/atoms/AnimateGif";
import Option from "@/components/atoms/Option";
import ModelMessage from "@/components/molecules/ModelMessage";
import getApiUrl from "@/constant/apiUrl";
import useTimeZone from "@/constant/timeZone";
import globalFonts from "@/theme/fontFamily";
import globalStyle from "@/theme/globalStyle";
import themeColors from "@/theme/themeColors";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useSelector } from "react-redux";

let db;

const TodayFeeling = () => {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  const [isError, setIsError] = useState(false);
  const [moods, setMoods] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  const isMounted = useRef(true);
  const abortController = useRef(null);
  const { userTimeZone } = useTimeZone();
  
  useEffect(() => {
    const initDB = async () => {
      try {
        db = await SQLite.openDatabaseAsync("moods.db");
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
          );
        `);
        setDbReady(true);
      } catch (error) {
        console.error("Database init error:", error);
      }
    };

    initDB();

    return () => {
      isMounted.current = false;
      if (abortController.current) abortController.current.abort();
    };
  }, []);


  const getLocalMoods = useCallback(async () => {
    if (!dbReady) return [];
    const result = await db.getAllAsync("SELECT * FROM moods;");
    return result.map((r) => r.name);
  }, [dbReady]);


  const saveMoodsToLocal = useCallback(async (moodList) => {
    if (!dbReady) return;
    await db.execAsync("DELETE FROM moods;");
    for (const mood of moodList) {
      await db.runAsync("INSERT INTO moods (name) VALUES (?);", [mood]);
    }
  }, [dbReady]);


  const fetchMoodsFromAPI = useCallback(async () => {
    const apiURL = getApiUrl();
    abortController.current = new AbortController();
    try {
      const response = await fetch(`${apiURL}/getMoodAndVibes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        signal: abortController.current.signal,
      });
      const data = await response.json();
      return data?.moods || [];
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error fetching moods:", err);
      return [];
    }
  }, [token]);


  const hasDataChanged = useCallback((localMoods, apiMoods) => {
    if (localMoods.length !== apiMoods.length) return true;
    return apiMoods.some((mood, i) => mood !== localMoods[i]);
  }, []);


  useEffect(() => {
    if (!dbReady) return;

    const loadMoods = async () => {
      setLoading(true);
      try {
        const localMoods = await getLocalMoods();
        if (isMounted.current && localMoods.length > 0) setMoods(localMoods);

        const apiMoods = await fetchMoodsFromAPI();

        if (isMounted.current && hasDataChanged(localMoods, apiMoods)) {
          await saveMoodsToLocal(apiMoods);
          setMoods(apiMoods);
          console.log("✅ Local moods updated from API");
        } else {
          console.log("ℹ️ Local moods are up to date");
        }
      } catch (error) {
        console.error("Error loading moods:", error);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    loadMoods();
  }, [dbReady, token, getLocalMoods, saveMoodsToLocal, fetchMoodsFromAPI, hasDataChanged]);


  const handleSelectItem = useCallback(async () => {
    if (!selected) {
      setIsError("Please select a mood before continuing.");
      return;
    }

    try {
      setLoading(true);
      const apiURL = getApiUrl();
      const response = await fetch(`${apiURL}/setMood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood: selected, timeZone: userTimeZone }),
      });

      const data = await response.json();
      if (data.status) router.push("vibePage");
      else setIsError(data.message || "Failed to set mood.");
    } catch (error) {
      console.error("Error:", error);
      setIsError("Something went wrong. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [selected, token, router]);


  return (
    <SafeAreaView style={[globalStyle.flexContainer, { padding: scale(20) }]}>
      <StatusBar barStyle="dark-content" />
      {isError && <ModelMessage message={isError} setIsError={setIsError} />}

      <LinearGradient
        style={styles.GradientBox}
        colors={[themeColors.secondaryVibrantPink, themeColors.primaryRichPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.optionContainer}>
          <Text
            style={[
              globalStyle.headingTitle,
              globalFonts.poppins_700,
              { color: themeColors.white, textAlign: "center" },
            ]}
          >
            🎭 How are you feeling today?
          </Text>

          <Text
            style={[
              globalStyle.commonText,
              globalFonts.poppins_500,
              { color: themeColors.white, textAlign: "center" },
            ]}
          >
            Your mood helps us find the right vibe for you!
          </Text>

          <View style={globalStyle.btnGrid}>
            {moods.map((item) => (
              <Option
                key={item}
                optionName={item}
                isSelected={selected === item}
                onSelect={() => setSelected(item)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={{ width: "100%", opacity: loading ? 0.6 : 1 }}
            onPress={handleSelectItem}
            disabled={loading}
          >
            <LinearGradient
              style={styles.button}
              colors={[themeColors.warmYellow, themeColors.warmYellowDark]}
            >
              {!loading ? (
                <Text style={[globalStyle.buttonText, globalFonts.poppins_600]}>Next</Text>
              ) : (
                <AnimateGif width={30} height={30} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  GradientBox: {
    borderRadius: moderateScale(15),
  },
  optionContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: moderateScale(40),
  },
  button: {
    paddingVertical: verticalScale(5),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    marginTop: verticalScale(20),
  },
});

export default TodayFeeling;

