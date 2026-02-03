
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

const TodayVibe = () => {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();

  const [isError, setIsError] = useState("");
  const [loading, setLoading] = useState(false);
  const [todayVibes, setTodayVibes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [dbReady, setDbReady] = useState(false);
  const { userTimeZone } = useTimeZone();
  const isMounted = useRef(true);
  const abortController = useRef(null);

  useEffect(() => {
    const initDB = async () => {
      try {
        db = await SQLite.openDatabaseAsync("vibes.db");
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS vibes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            option TEXT
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

  const getLocalVibes = useCallback(async () => {
    if (!dbReady) return {};
    const result = await db.getAllAsync("SELECT category, option FROM vibes;");
    const grouped = {};
    result.forEach(({ category, option }) => {
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(option);
    });
    return grouped;
  }, [dbReady]);

  const saveVibesToLocal = useCallback(async (vibes) => {
    if (!dbReady) return;
    await db.execAsync("DELETE FROM vibes;");
    for (const [category, options] of Object.entries(vibes)) {
      for (const opt of options) {
        await db.runAsync("INSERT INTO vibes (category, option) VALUES (?, ?);", [
          category,
          opt,
        ]);
      }
    }
  }, [dbReady]);

  const fetchVibesFromAPI = useCallback(async () => {
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
      return data?.vibes || {};
    } catch (err) {
      if (err.name !== "AbortError") console.error("Error fetching vibes:", err);
      return {};
    }
  }, [token]);

  const hasDataChanged = useCallback((localVibes, apiVibes) => {
    const localKeys = Object.keys(localVibes);
    const apiKeys = Object.keys(apiVibes);
    if (localKeys.length !== apiKeys.length) return true;
    for (const key of apiKeys) {
      const localOptions = localVibes[key] || [];
      const apiOptions = apiVibes[key] || [];
      if (
        localOptions.length !== apiOptions.length ||
        apiOptions.some((v, i) => v !== localOptions[i])
      ) {
        return true;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    if (!dbReady) return;

    const loadVibes = async () => {
      setLoading(true);
      try {
        const localVibes = await getLocalVibes();
        if (isMounted.current && Object.keys(localVibes).length > 0)
          setTodayVibes(localVibes);

        const apiVibes = await fetchVibesFromAPI();

        if (isMounted.current && hasDataChanged(localVibes, apiVibes)) {
          await saveVibesToLocal(apiVibes);
          setTodayVibes(apiVibes);
          console.log("✅ Local vibes updated from API");
        } else {
          console.log("ℹ️ Local vibes are up to date");
        }
      } catch (error) {
        console.error("Error loading vibes:", error);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    };

    loadVibes();
  }, [dbReady, token, getLocalVibes, saveVibesToLocal, fetchVibesFromAPI, hasDataChanged]);

  const handleSelect = useCallback((category, option) => {
    if (selectedCategory && selectedCategory !== category) {
      setSelectedOptions({});
      setSelectedCategory(category);
    }
    if (!selectedCategory) {
      setSelectedCategory(category);
    }

    setSelectedOptions((prev) => {
      const optionsForCategory = prev[category] || [];
      const isSelected = optionsForCategory.includes(option);
      return {
        ...prev,
        [category]: isSelected
          ? optionsForCategory.filter((o) => o !== option)
          : [...optionsForCategory, option],
      };
    });
  }, [selectedCategory]);

  const handleSelectItem = useCallback(async () => {
    if (!selectedCategory || !selectedOptions[selectedCategory]?.length) {
      setIsError("Please select at least one option in a single category.");
      return;
    }

    const vibes = selectedOptions[selectedCategory];

    try {
      setLoading(true);
      const apiURL = getApiUrl();
      const response = await fetch(`${apiURL}/setVibe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ vibe: vibes, timeZone: userTimeZone }),
      });

      const { status, message } = await response.json();
      if (status) router.push("/match/");
      else setIsError(message || "Something went wrong.");
    } catch (error) {
      console.error("API Error:", error);
      setIsError("Something went wrong. Please try again.");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [selectedCategory, selectedOptions, token, router]);

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
          <Text style={[globalStyle.headingTitle, globalFonts.poppins_700, styles.centerText]}>
            🎶 What’s your vibe today?
          </Text>
          <Text style={[globalStyle.commonText, globalFonts.poppins_500, styles.centerText]}>
            Let’s set the tone for your matches!
          </Text>

          {Object.entries(todayVibes)?.map(([category, options]) => (
            <View key={category} style={[globalStyle.MarginTop10, { width: "100%" }]}>
              <Text
                style={[
                  globalStyle.commonHeading,
                  globalFonts.poppins_500,
                  { color: themeColors.white },
                ]}
              >
                {category}
              </Text>

              <View style={[globalStyle.btnGrid, { justifyContent: "flex-start", marginTop: 5 }]}>
                {options.map((option, index) => (
                  <Option
                    key={index}
                    optionName={option}
                    isSelected={selectedOptions[category]?.includes(option)}
                    onSelect={() => handleSelect(category, option)}
                  />
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={{ width: "100%", opacity: loading ? 0.6 : 1 }}
            disabled={loading}
            onPress={handleSelectItem}
          >
            <LinearGradient
              style={styles.button}
              colors={[themeColors.warmYellow, themeColors.warmYellowDark]}
            >
              {!loading ? (
                <Text style={[globalStyle.buttonText, globalFonts.poppins_700]}>Next</Text>
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
    padding: moderateScale(30),
  },
  button: {
    paddingVertical: verticalScale(5),
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    marginTop: verticalScale(20),
  },
  centerText: {
    color: themeColors.white,
    textAlign: "center",
  },
});

export default TodayVibe;
