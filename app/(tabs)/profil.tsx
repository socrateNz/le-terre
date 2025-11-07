import { Image } from "expo-image";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { formatNumberToXAF } from "@/libs/utils";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { LucideEdit, LucidePlus, LucideWallet } from "lucide-react-native";

const TabTwoScreen = () => {
  const { currentUser } = useAppStore();
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <View className="flex flex-col gap-10">
        <View className="flex flex-col items-center gap-4">
          <View className="rounded-full w-[190px] h-[190px] overflow-hidden border-4 border-gray-300">
            <Image
              source={
                currentUser?.image ?? require("@/assets/images/carr3.webp")
              }
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View className="flex flex-col items-center gap-1">
            <Text
              className={`text-[28px] font-semibold ${colorScheme === "dark" ? "text-white" : "text-black"}`}
            >
              {currentUser?.username}
            </Text>
            <Text
              className={`text-gray-500 text-[20px] ${colorScheme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {currentUser?.email}
            </Text>
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <TouchableOpacity
            onPress={() => router.push("/recharge")}
            className="flex flex-row items-center gap-2 border-b border-[#E5E5E5] pb-4"
          >
            <LucideWallet
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text
              className={`text-2xl ${colorScheme === "dark" ? "text-white" : "text-black"}`}
            >
              {"Recharger le solde: " +
                formatNumberToXAF(currentUser?.balance ?? 0)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/recharge")}
            className="flex flex-row items-center gap-2 border-b border-[#E5E5E5] pb-4"
          >
            <LucidePlus
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text
              className={`text-2xl ${colorScheme === "dark" ? "text-white" : "text-black"}`}
            >
              {"Créer une partie"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/recharge")}
            className="flex flex-row items-center gap-2"
          >
            <LucideEdit
              size={24}
              color={colorScheme === "dark" ? "white" : "black"}
            />
            <Text
              className={`text-2xl ${colorScheme === "dark" ? "text-white" : "text-black"}`}
            >
              {"Modifier le profil"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TabTwoScreen;
