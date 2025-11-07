import { formatNumberToXAF } from "@/libs/utils";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import "../../global.css";

const COLORS = {
  primary: "#1F8E97",
  secondary: "#004955",
  background: "#FFFFFF",
};

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useAppStore();
  const colorScheme = useColorScheme();
  const [dice, setDice] = useState<number | undefined>(undefined);

  const demandes = [
    {
      id: 1,
      by: "User1",
      payers: 3,
      amount: 200,
      status: "pending",
    },
    {
      id: 1,
      by: "User1",
      payers: 3,
      amount: 200,
      status: "ended",
    },
    {
      id: 1,
      by: "User1",
      payers: 3,
      amount: 200,
      status: "programmed",
    },
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {/* Liste des demandes de jeux */}
      <View className="flex flex-col gap-3">
        <Text className={`text-lg font-bold ${colorScheme === "dark" ? "text-white" : "text-black"}`}>Jeux</Text>
        {/* Liste des demandes de jeux ici */}
        {demandes.map((demande, ind) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/game`);
            }}
            key={ind}
            className={`p-4 rounded-lg mb-4 ${colorScheme === "dark" ? "bg-[#a5a5a5]" : "bg-white"} shadow-sm`}
          >
            <Text className="font-semibold">Créé par: {demande.by}</Text>
            <Text>Nombre de payeurs: {demande.payers}</Text>
            <Text>Montant: {formatNumberToXAF(demande.amount)}</Text>
            <View className="flex flex-row items-center gap-1">
              <Text>Status: </Text>
              <View
                className={`px-2 py-1 rounded-md ${demande.status === "pending" ? "bg-green-500" : demande.status === "ended" ? "bg-red-500" : "bg-orange-500"}`}
              >
                <Text className="text-white">{demande.status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
