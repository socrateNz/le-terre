import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLORS = {
  primary: "#005A9A",
  secondary: "#005A9A",
  background: "#FFFFFF",
  red: "#E74C3C",
  yellow: "#F1C40F",
  green: "#2ECC71",
  blue: "#3498DB",
};

type Player = {
  id: string;
  name: string;
  color: string;
  position: number;
  score: number;
  diceValues: number[];
};

export default function GameScreen() {
  const router = useRouter();
  const { currentUser, bet, setStake, resolveWinner, resetBet } =
    useAppStore();

  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [rolling, setRolling] = useState(false);
  const [diceValues, setDiceValues] = useState<{[key: string]: number[]}>({
    me: [1, 1],
    opponent: [1, 1],
  });
  const [scores, setScores] = useState<{[key: string]: number}>({
    me: 0,
    opponent: 0,
  });
  
  const diceAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const [animatedValues, setAnimatedValues] = useState<{[key: string]: number[]}>({
    me: [1, 1],
    opponent: [1, 1],
  });

  // Configuration des joueurs
  const players: Player[] = [
    {
      id: 'me',
      name: currentUser?.username ?? 'Vous',
      color: COLORS.red,
      position: 0,
      score: scores.me,
      diceValues: diceValues.me,
    },
    {
      id: 'opponent',
      name: bet.opponent?.username ?? 'Adversaire',
      color: COLORS.blue,
      position: 0,
      score: scores.opponent,
      diceValues: diceValues.opponent,
    },
  ];

  const currentPlayerObj = players[currentPlayer];
  
  // Vérifier si la mise est configurée
  const isStakeSet = bet.stake && bet.stake > 0;
  // Vérifier si tous les joueurs ont joué
  const allPlayersPlayed = Object.values(scores).every(score => score > 0);

  const animateDiceWithFaces = async (diceIndex: number, finalValue: number): Promise<void> => {
    return new Promise((resolve) => {
      const animation = Animated.timing(diceAnimations[diceIndex], {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      });

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / 1200, 1);
        
        if (progress < 0.9) {
          const randomValue = Math.ceil(Math.random() * 6);
          setAnimatedValues(prev => {
            const newValues = [...prev[currentPlayerObj.id]];
            newValues[diceIndex] = randomValue;
            return {
              ...prev,
              [currentPlayerObj.id]: newValues,
            };
          });
        } else {
          setAnimatedValues(prev => {
            const newValues = [...prev[currentPlayerObj.id]];
            newValues[diceIndex] = finalValue;
            return {
              ...prev,
              [currentPlayerObj.id]: newValues,
            };
          });
        }
      }, 100);

      animation.start(() => {
        clearInterval(interval);
        diceAnimations[diceIndex].setValue(0);
        setAnimatedValues(prev => {
          const newValues = [...prev[currentPlayerObj.id]];
          newValues[diceIndex] = finalValue;
          return {
            ...prev,
            [currentPlayerObj.id]: newValues,
          };
        });
        resolve();
      });
    });
  };

  const showResultAlert = (winner: "me" | "opponent" | "draw") => {
    const stakeAmount = bet.stake?.toLocaleString() || '0';
    
    if (winner === "me") {
      Alert.alert(
        "🎉 Félicitations !",
        `Vous avez gagné ${stakeAmount} FCFA !\nVotre solde a été crédité.`,
        [
          {
            text: "Continuer",
            style: "default"
          }
        ]
      );
    } else if (winner === "opponent") {
      // Débiter le joueur (déjà fait au début)
      Alert.alert(
        "😔 Dommage !",
        `Vous avez perdu ${stakeAmount} FCFA !\nVotre solde a été débité.`,
        [
          {
            text: "Continuer", 
            style: "default"
          }
        ]
      );
    } else {
      Alert.alert(
        "🤝 Égalité !",
        `Match nul ! Votre mise de ${stakeAmount} FCFA vous est restituée.`,
        [
          {
            text: "Continuer",
            style: "default"
          }
        ]
      );
    }
  };

  const handleSetStake = (amount: string) => {
    const stakeValue = Number(amount);
    setStake(stakeValue);
    
    // Vérifier si le solde est suffisant quand la mise est définie
    if (stakeValue > 0 && currentUser && currentUser.balance < stakeValue) {
      Alert.alert(
        "Solde insuffisant",
        `Votre solde actuel est de ${currentUser.balance.toLocaleString()} FCFA.\nVeuillez recharger votre compte.`,
        [
          { text: "Annuler", style: "cancel" },
          { 
            text: "Recharger", 
            onPress: () => router.push('/recharge') 
          }
        ]
      );
      setStake(0); // Réinitialiser la mise
    }
  };

  const handleRollDice = async () => {
    if (rolling || !isStakeSet) return;
    
    // Vérifier une dernière fois le solde avant de commencer
    if (currentUser && bet.stake && currentUser.balance < bet.stake) {
      Alert.alert(
        "Solde insuffisant",
        "Votre solde a changé. Veuillez recharger votre compte.",
        [
          { text: "OK", onPress: () => router.push('/recharge') }
        ]
      );
      return;
    }
    setRolling(true);
    
    const newValues = [
      Math.ceil(Math.random() * 6),
      Math.ceil(Math.random() * 6),
    ];
    
    await Promise.all([
      animateDiceWithFaces(0, newValues[0]),
      animateDiceWithFaces(1, newValues[1]),
    ]);
    
    const playerKey = currentPlayerObj.id;
    setDiceValues(prev => ({
      ...prev,
      [playerKey]: newValues,
    }));
    
    const total = newValues[0] + newValues[1];
    setScores(prev => ({
      ...prev,
      [playerKey]: total,
    }));
    
    const nextPlayer = (currentPlayer + 1) % players.length;
    const allPlayed = nextPlayer === 0;
    
    setCurrentPlayer(nextPlayer);
    setRolling(false);

    if (allPlayed) {
      setTimeout(() => {
        let winner: "me" | "opponent" | "draw" = "draw";
        
        if (scores.me > total) {
          winner = "me";
        } else if (total > scores.me) {
          winner = "opponent";
        }
        
        resolveWinner();
        showResultAlert(winner);
      }, 500);
    }
  };

  const handleResolve = () => {
    let winner: "me" | "opponent" | "draw" = "draw";
    
    if (scores.me > scores.opponent) {
      winner = "me";
    } else if (scores.opponent > scores.me) {
      winner = "opponent";
    }

    resolveWinner();
    showResultAlert(winner);
  };

  const handleFinish = () => {
    resetBet();
    router.replace("/(tabs)");
  };

  const renderAnimatedDice = (value: number, index: number, playerId: string) => {
    const isCurrentPlayer = playerId === currentPlayerObj.id;
    const displayValue = rolling && isCurrentPlayer ? animatedValues[playerId][index] : value;
    
    const rotate = diceAnimations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '1080deg'],
    });

    const translateY = diceAnimations[index].interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -25, 5, -15, 0],
    });

    const translateX = diceAnimations[index].interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 10, 0],
    });

    const scale = diceAnimations[index].interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [1, 1.1, 0.95, 1],
    });

    return (
      <Animated.View
        key={`${playerId}-dice-${index}`}
        style={{
          transform: isCurrentPlayer ? [
            { rotate },
            { translateY },
            { translateX },
            { scale }
          ] : [],
          width: 50,
          height: 50,
          backgroundColor: playerId === 'me' ? COLORS.primary : COLORS.secondary,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          margin: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 3,
          elevation: 5,
          opacity: isCurrentPlayer ? 1 : 0.7,
        }}
      >
        {renderDiceFace(displayValue)}
      </Animated.View>
    );
  };

  const renderDiceFace = (value: number) => {
    const positions: { [key: number]: number[][] } = {
      1: [[1, 1]],
      2: [[0, 0], [2, 2]],
      3: [[0, 0], [1, 1], [2, 2]],
      4: [[0, 0], [0, 2], [2, 0], [2, 2]],
      5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
      6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
    };

    const dots = positions[value] || [];

    return (
      <View className="flex-row flex-wrap w-[40px] h-[40px] justify-between p-1">
        {[0, 1, 2].map((row) => (
          <View key={row} className="flex-row justify-between w-full">
            {[0, 1, 2].map((col) => {
              const isDot = dots.some((p) => p[0] === row && p[1] === col);
              return (
                <View
                  key={`${row}-${col}`}
                  className="w-[10px] h-[10px] items-center justify-center"
                >
                  {isDot && (
                    <View className="w-[6px] h-[6px] rounded-full bg-white" />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Bouton de retour */}
        <Pressable
          className="rounded-full w-fit p-2 "
          onPress={() => router.back()}
        >
          <Text className="text-[#007AFF] text-[20px]">← Retour</Text>
        </Pressable>
        <Text
          className="text-2xl font-semibold text-center mb-6"
          style={{ color: COLORS.secondary }}
        >
          Partie de Dé
        </Text>

        {/* Affichage du solde */}
        <View className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <Text className="text-blue-800 text-center text-sm font-semibold">
            Solde actuel
          </Text>
          <Text className="text-blue-900 text-center text-2xl font-bold mt-1">
            {currentUser?.balance?.toLocaleString() || '0'} FCFA
          </Text>
          {bet.stake && currentUser && (
            <Text className="text-blue-600 text-center text-xs mt-1">
              Après mise : {(currentUser.balance - bet.stake).toLocaleString()} FCFA
            </Text>
          )}
        </View>

        {/* Champ de mise */}
        <View className="mb-6">
          <Text className="text-center mb-2 font-semibold">
            Montant de la mise (FCFA)
          </Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Entrez votre mise"
            className={`border rounded-xl p-3 text-center text-lg ${
              isStakeSet ? 'border-green-500 bg-green-50' : 'border-gray-300'
            } ${
              currentUser && bet.stake && currentUser.balance < bet.stake 
                ? 'border-red-500 bg-red-50' 
                : ''
            }`}
            onChangeText={handleSetStake}
            value={bet.stake?.toString() ?? ""}
          />
          {!isStakeSet && (
            <Text className="text-red-500 text-sm text-center mt-2">
              Veuillez configurer la mise pour pouvoir jouer
            </Text>
          )}
          {currentUser && bet.stake && currentUser.balance < bet.stake && (
            <Text className="text-red-500 text-sm text-center mt-2">
              ❌ Solde insuffisant ! Votre solde est de {currentUser.balance.toLocaleString()} FCFA
            </Text>
          )}
        </View>

        {/* Zone des joueurs */}
        <View className="flex flex-col gap-4">
          {players.map((player, index) => (
            <View
              key={player.id}
              className={`p-4 rounded-xl border-2 ${
                currentPlayer === index 
                  ? 'border-yellow-400 bg-yellow-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-semibold text-lg" style={{ color: player.color }}>
                  {player.name}
                </Text>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="font-bold text-lg">{scores[player.id]}</Text>
                </View>
              </View>

              <View className="flex-row justify-center">
                {diceValues[player.id].map((value, diceIndex) =>
                  renderAnimatedDice(value, diceIndex, player.id)
                )}
              </View>

              {currentPlayer === index && (
                <View className="mt-2 items-center">
                  <Text className="text-sm text-gray-600">🎯 C'est votre tour</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Bouton de lancer */}
        <TouchableOpacity
          className="py-4 rounded-xl mt-6"
          style={{ 
            backgroundColor: (isStakeSet && currentUser && (!bet.stake || currentUser.balance >= bet.stake)) 
              ? currentPlayerObj.color 
              : '#CCCCCC',
            opacity: (rolling || !isStakeSet || (currentUser && bet.stake && currentUser.balance < bet.stake)) ? 0.7 : 1 
          }}
          onPress={handleRollDice}
          disabled={rolling || !isStakeSet || (currentUser  && currentUser.balance < bet.stake)}
        >
          <Text className="text-center text-white font-semibold text-lg">
            {!isStakeSet 
              ? 'Configurez la mise pour jouer'
              : (currentUser && bet.stake && currentUser.balance < bet.stake)
              ? 'Solde insuffisant'
              : rolling 
                ? 'Lancement en cours...' 
                : `Lancer les dés (${currentPlayerObj.name})`
            }
          </Text>
        </TouchableOpacity>

        {/* Bouton résultat manuel */}
        {allPlayersPlayed && !bet.winner && (
          <TouchableOpacity
            className="py-4 rounded-xl mt-4"
            style={{ backgroundColor: COLORS.primary }}
            onPress={handleResolve}
          >
            <Text className="text-center text-white font-semibold">
              Voir le résultat final
            </Text>
          </TouchableOpacity>
        )}

        {/* Résultat affiché dans l'interface */}
        {bet.winner && (
          <View className="mt-6 items-center p-4 bg-gray-50 rounded-xl">
            {bet.winner === "draw" ? (
              <Text className="text-xl font-semibold">Égalité 😮</Text>
            ) : (
              <Text className="text-xl font-semibold text-center">
                {bet.winner === "me"
                  ? `🎉 ${currentUser?.username} gagne ${bet.stake?.toLocaleString()} FCFA !`
                  : `🎉 ${bet.opponent?.username} gagne ${bet.stake?.toLocaleString()} FCFA !`}
              </Text>
            )}
            <View className="flex-row justify-between w-full mt-4">
              <Text className="text-lg">Vous: {scores.me}</Text>
              <Text className="text-lg">Adversaire: {scores.opponent}</Text>
            </View>
            <View className="mt-4 p-3 bg-green-50 rounded-lg w-full">
              <Text className="text-green-800 text-center font-semibold">
                Nouveau solde : {currentUser?.balance?.toLocaleString()} FCFA
              </Text>
            </View>
            <TouchableOpacity
              className="py-4 rounded-xl mt-4 w-full"
              style={{ backgroundColor: COLORS.secondary }}
              onPress={handleFinish}
            >
              <Text className="text-center text-white font-semibold">
                Terminer la partie
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}