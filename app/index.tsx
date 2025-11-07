import { useAppStore } from "@/store/useAppStore";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "../global.css";
import OnboardingScreen from "./onboarding";

const COLORS = {
  primary: "#1F8E97",
  secondary: "#004955",
  background: "#FFFFFF",
};

export default function LoginScreen() {
  const router = useRouter();
  const { onboardingCompleted } = useAppStore();
  const loginOrRegister = useAppStore((s) => s.loginOrRegister);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [page, setPage] = useState("login");

  // Alert if username or password is empty

  const handleLogin = () => {
    if (username === "") {
      Alert.alert("Veuillez remplir le nom d'utilisateur");
      return;
    }
    if (password === "") {
      Alert.alert("Veuillez remplir le mot de passe");
      return;
    }
    loginOrRegister(username, password);
    router.push("/(tabs)");
  };

  if (!onboardingCompleted) {
    return <OnboardingScreen />;
  } else {
    return (
      <View className="flex-1 flex justify-center h-full bg-white">
        {page === "login" ? (
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              flex: 1,
              justifyContent: "center",
              gap: 40,
            }}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 150, height: 150, alignSelf: "center" }}
            />
            <TouchableOpacity
              className="py-4 rounded-xl"
              style={{ backgroundColor: "black" }}
              onPress={() => setPage("register")}
            >
              <Text className="text-center text-white font-semibold">
                Créer un compte
              </Text>
            </TouchableOpacity>
            <View className="gap-4">
              <TextInput
                className="border rounded-xl px-4 py-3 h-12"
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={"#0E0E0E"}
              />
              <TextInput
                className="border rounded-xl px-4 py-3 h-12"
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={"#0E0E0E"}
              />
              <TouchableOpacity
                className="py-4 rounded-xl"
                style={{ backgroundColor: COLORS.primary }}
                onPress={handleLogin}
              >
                <Text className="text-center text-white font-semibold">
                  Se connecter
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            contentContainerStyle={{
              padding: 16,
              flex: 1,
              justifyContent: "center",
              gap: 40,
            }}
          >
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 150, height: 150, alignSelf: "center" }}
            />
            <TouchableOpacity
              className="py-4 rounded-xl"
              style={{ backgroundColor: "black" }}
              onPress={() => setPage("login")}
            >
              <Text className="text-center text-white font-semibold">
                Se connecter
              </Text>
            </TouchableOpacity>
            <View className="gap-4">
              <TextInput
                className="border rounded-xl px-4 py-3 h-12"
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={"#0E0E0E"}
              />
              <TextInput
                className="border rounded-xl px-4 py-3 h-12"
                placeholder="Numéro de téléphone (optionnel)"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor={"#0E0E0E"}
              />
              <TextInput
                className="border rounded-xl px-4 py-3 h-12"
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={"#0E0E0E"}
              />
              <TextInput
                className="border rounded-xl px-4 py-3 h-12"
                placeholder="Confirmer le mot de passe"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor={"#0E0E0E"}
              />
              <TouchableOpacity
                className="py-4 rounded-xl"
                style={{ backgroundColor: COLORS.primary }}
                onPress={() => setPage("login")}
              >
                <Text className="text-center text-white font-semibold">
                  Créer un compte
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}
