import { useAppStore } from '@/store/useAppStore';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../global.css';

const COLORS = {
  primary: '#1F8E97',
  secondary: '#004955',
  background: '#FFFFFF',
};

const STAKES = [100, 500, 1000, 5000];

export default function PariScreen() {
  const router = useRouter();
  const { currentUser, players, bet, setStake, selectOpponent } = useAppStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-semibold text-center mb-4" style={{ color: COLORS.secondary }}>Parier avec un joueur</Text>
        <Text className="text-center mb-6">Votre solde: {(currentUser?.balance ?? 0).toLocaleString()} XAF</Text>

        <Text className="mb-2 font-semibold">Choisir une mise</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {STAKES.map((s) => (
            <TouchableOpacity key={s} className="px-4 py-2 rounded-xl" style={{ backgroundColor: bet.stake === s ? COLORS.secondary : COLORS.primary }} onPress={() => setStake(s)}>
              <Text className="text-white font-medium">{s.toLocaleString()} XAF</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text className="mb-2 font-semibold">Joueurs disponibles</Text>
        <View className="gap-3">
          {players.map((p) => (
            <TouchableOpacity key={p.username} className="p-4 rounded-xl border" style={{ borderColor: bet.opponent?.username === p.username ? COLORS.secondary : '#e5e7eb' }} onPress={() => selectOpponent(p)}>
              <Text className="font-semibold">{p.username}</Text>
              <Text className="text-gray-600">Solde: {p.balance.toLocaleString()} XAF</Text>
            </TouchableOpacity>
          ))}
        </View>

        {bet.opponent && bet.stake > 0 ? (
          <View className="mt-6">
            <Text className="text-center mb-4">{currentUser?.username ?? '@Toi'} veut jouer avec {bet.opponent.username} pour {bet.stake.toLocaleString()} XAF</Text>
            <TouchableOpacity className="py-4 rounded-xl" style={{ backgroundColor: COLORS.primary }} onPress={() => router.push('/game')}>
              <Text className="text-center text-white font-semibold">Accepter le pari</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}


