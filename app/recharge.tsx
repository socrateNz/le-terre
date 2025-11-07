import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';

const COLORS = {
  primary: '#1F8E97',
  secondary: '#004955',
  background: '#FFFFFF',
};

export default function RechargeScreen() {
  const router = useRouter();
  const recharge = useAppStore((s) => s.recharge);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');

  const onConfirm = () => {
    const value = parseInt(amount, 10);
    if (!value || value <= 0) {
      Alert.alert('Montant invalide');
      return;
    }
    recharge(value);
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-semibold text-center mb-6" style={{ color: COLORS.secondary }}>Recharger mon compte</Text>
        <View className="gap-4">
          <TextInput
            className="border rounded-xl px-4 py-3"
            placeholder="Montant"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TextInput
            className="border rounded-xl px-4 py-3"
            placeholder="Numéro (Orange/MTN Money)"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TouchableOpacity className="py-4 rounded-xl" style={{ backgroundColor: COLORS.primary }} onPress={onConfirm}>
            <Text className="text-center text-white font-semibold">Confirmer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


