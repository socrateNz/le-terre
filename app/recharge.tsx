import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const COLORS = {
  primary: "#005A9A",
  secondary: "#005A9A",
  background: "#FFFFFF",
  success: "#22C55E",
  error: "#EF4444",
};

export default function RechargeScreen() {
  const router = useRouter();
  const recharge = useAppStore((s) => s.recharge);
  const currentUser = useAppStore((s) => s.currentUser);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const colorScheme = useColorScheme();

  const onConfirm = async () => {
    const value = parseInt(amount, 10);

    if (!value || value <= 0) {
      Alert.alert("Erreur", "Veuillez entrer un montant valide");
      return;
    }

    if (!phone || phone.length < 8) {
      Alert.alert("Erreur", "Veuillez entrer un numéro de téléphone valide");
      return;
    }

    setStatus("pending");

    // Simulation du processus de recharge avec possibilité d'échec
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulation d'échec aléatoire (20% de chance d'échec pour la démo)
          const isSuccess = Math.random() > 0.2;
          if (isSuccess) {
            resolve(true);
          } else {
            reject(new Error("Échec de la transaction"));
          }
        }, 2000);
      });

      // Si succès, recharger le compte
      recharge(value);

      setStatus("success");

      // Redirection après un délai pour montrer le succès
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error) {
      setStatus("failed");
      // L'alerte est maintenant gérée par l'état failed
    }
  };

  const retryRecharge = () => {
    setStatus("idle");
  };

  const isFormValid = amount && phone && parseInt(amount, 10) > 0;

  if (status === "success") {
    return (
      <SafeAreaView
        className={`flex-1 flex justify-center h-full ${colorScheme === "dark" ? "bg-black" : "bg-white"}`}
      >
        <Pressable
          className="rounded-full w-fit p-2 "
          onPress={() => router.back()}
        >
          <Text className={`text-${colorScheme === "dark" ? "white" : "black"} text-[20px]`}>← Retour</Text>
        </Pressable>
        <View className="items-center justify-center p-8">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-6">
            <Text className="text-4xl">✅</Text>
          </View>
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: COLORS.success }}
          >
            Recharge réussie !
          </Text>
          <Text className="text-lg text-center text-gray-600 mb-8">
            Votre compte a été rechargé de {parseInt(amount).toLocaleString()}{" "}
            FCFA
          </Text>
          <Text className="text-sm text-center text-gray-500">
            Redirection en cours...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (status === "failed") {
    return (
      <SafeAreaView
        className={`flex-1 flex justify-center h-full ${colorScheme === "dark" ? "bg-black" : "bg-white"}`}
      >
        <Pressable
          className="rounded-full w-fit p-2 "
          onPress={() => router.back()}
        >
          <Text className={`text-${colorScheme === "dark" ? "white" : "black"} text-[20px]`}>← Retour</Text>
        </Pressable>
        <View className="items-center justify-center p-8">
          <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-6">
            <Text className="text-4xl">❌</Text>
          </View>
          <Text
            className="text-2xl font-bold text-center mb-2"
            style={{ color: COLORS.error }}
          >
            Échec de la recharge
          </Text>
          <Text className="text-lg text-center text-gray-600 mb-6">
            La recharge de {parseInt(amount).toLocaleString()} FCFA a échoué
          </Text>
          <Text className="text-sm text-center text-gray-500 mb-8">
            Veuillez vérifier votre solde mobile money et réessayer
          </Text>

          <View className="flex-row gap-4 w-full">
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl border border-gray-300"
              onPress={() => router.back()}
            >
              <Text className="text-center text-gray-700 font-semibold">
                Annuler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl"
              style={{ backgroundColor: COLORS.primary }}
              onPress={retryRecharge}
            >
              <Text className="text-center text-white font-semibold">
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 flex justify-center h-full ${colorScheme === "dark" ? "bg-black" : "bg-white"}`}
    >
      <Pressable
          className="rounded-full w-fit p-2 "
          onPress={() => router.back()}
        >
          <Text className={`text-${colorScheme === "dark" ? "white" : "black"} text-[20px]`}>← Retour</Text>
        </Pressable>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* Affichage du solde actuel */}
        <View className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Text className="text-blue-800 text-center text-sm font-semibold">
            Solde actuel
          </Text>
          <Text className="text-blue-900 text-center text-2xl font-bold mt-1">
            {currentUser?.balance?.toLocaleString() || "0"} FCFA
          </Text>
        </View>

        <Text
          className="text-2xl font-semibold text-center mb-6"
          style={{ color: COLORS.secondary }}
        >
          Recharger mon compte
        </Text>

        <View className="gap-4">
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Montant (FCFA)
            </Text>
            <TextInput
              className={`border rounded-xl px-4 py-3 text-lg ${
                colorScheme === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-black border-gray-300"
              }`}
              placeholder="Ex: 5000"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              editable={status !== "pending"}
            />
          </View>

          <View>
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Numéro de téléphone
            </Text>
            <TextInput
              className={`border rounded-xl px-4 py-3 text-lg ${
                colorScheme === "dark"
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-white text-black border-gray-300"
              }`}
              placeholder="Ex: 07 12 34 56 78"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              editable={status !== "pending"}
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-xl mt-4 ${
              !isFormValid || status === "pending" ? "opacity-50" : ""
            }`}
            style={{ backgroundColor: COLORS.primary }}
            onPress={onConfirm}
            disabled={!isFormValid || status === "pending"}
          >
            {status === "pending" ? (
              <View className="flex-row items-center justify-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-center text-white font-semibold ml-2">
                  Recharge en cours...
                </Text>
              </View>
            ) : (
              <Text className="text-center text-white font-semibold text-lg">
                Confirmer la recharge
              </Text>
            )}
          </TouchableOpacity>

          {status === "pending" && (
            <View className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <Text className="text-blue-800 text-center text-sm">
                ⏳ Traitement de votre recharge de{" "}
                {parseInt(amount).toLocaleString()} FCFA...
              </Text>
              <Text className="text-blue-600 text-center text-xs mt-1">
                Veuillez ne pas quitter cette page
              </Text>
            </View>
          )}
        </View>

        {/* Informations utiles */}
        <View className="mt-8 p-4 bg-gray-50 rounded-xl">
          <Text className="text-sm font-semibold text-gray-700 mb-2">
            💡 Informations :
          </Text>
          <Text className="text-xs text-gray-600">
            • Les recharges sont instantanées{"\n"}• Support Orange Money & MTN
            Mobile Money{"\n"}• Aucun frais supplémentaire{"\n"}• En cas
            d'échec, votre argent ne sera pas débité
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
