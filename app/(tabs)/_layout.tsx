import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatNumberToXAF } from "@/libs/utils";
import { useAppStore } from "@/store/useAppStore";
import { Image } from "expo-image";
import { Tabs, useRouter } from "expo-router";
import { LucidePlus, LucideWallet } from "lucide-react-native"; // 👈 après avoir installé lucide-react-native
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: true,
          tabBarStyle: {
            height: 70,
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
            borderTopColor: colorScheme === "dark" ? "#222" : "#eee",
          },
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
                  className="h-fit flex flex-row items-center justify-center gap-2 rounded-[40px] p-2"
                  onPress={() => router.push("/recharge")}
                >
                  <LucideWallet size={20} color={"white"} />
                  <Text className="text-white text-[16px] font-medium">
                    {formatNumberToXAF(currentUser?.balance ?? 0)}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: COLORS.background,
                  borderColor: COLORS.primary,
                }}
                className="h-fit flex flex-row items-center justify-center rounded-[40px] p-2"
                onPress={() => router.push("/recharge")}
              >
                <LucidePlus size={20} color={"black"} />
                <Text className="text-primary text-xl font-medium">Nouveau</Text>
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
          name="profil"
          options={{
            title: "Profil",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
