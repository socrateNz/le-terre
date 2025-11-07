import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatNumberToXAF } from "@/libs/utils";
import { useAppStore } from "@/store/useAppStore";
import { Image } from "expo-image";
import { Tabs, useRouter } from "expo-router";
import { LucidePlus } from "lucide-react-native"; // 👈 après avoir installé lucide-react-native
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


const COLORS = {
  primary: "#005A9A",
  secondary: "#004955",
  background: "#FFFFFF",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { currentUser } = useAppStore();

  return (
    <SafeAreaProvider
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            headerShown: true, // ✅ afficher le header
            headerStyle: {
              backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 18,
              color: colorScheme === "dark" ? "#fff" : "#000",
            },
            header: () => (
              <View className="flex flex-row items-center justify-between px-4">
                <View className="flex flex-row items-center gap-2">
                  <Image
                    source={require("@/assets/images/logo.png")}
                    style={{ width: 50, height: 50 }}
                  />

                  <TouchableOpacity
                    style={{ backgroundColor: COLORS.primary }}
                    className="h-fit flex flex-row item-center justify-center rounded-[40px] p-2"
                    onPress={() => router.push("/recharge")}
                  >
                    <LucidePlus size={24} color={"white"} />
                    <Text className="text-white text-xl font-bold">
                      {formatNumberToXAF(currentUser?.balance ?? 0)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: COLORS.background,
                    borderColor: COLORS.primary,
                  }}
                  className="h-fit flex flex-row item-center justify-center rounded-[40px] p-2"
                  onPress={() => router.push("/recharge")}
                >
                  <Text className="text-primary text-xl font-bold">
                    Nouveau
                  </Text>
                </TouchableOpacity>
              </View>
            ),
            tabBarButton: HapticTab,
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Accueil",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="house.fill" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: "Explorer",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={28} name="paperplane.fill" color={color} />
              ),
            }}
          />
        </Tabs>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
