import { create } from 'zustand';

export type Player = {
  username: string;
  balance: number;
  phone?: string;
};

export type Bet = {
  stake: number;
  opponent?: Player;
  myRoll?: number;
  opponentRoll?: number;
  winner?: 'me' | 'opponent' | 'draw';
};

type AppState = {
  currentUser?: Player;
  users: Record<string, Player>;
  players: Player[];
  bet: Bet;
  // actions
  loginOrRegister: (username: string, password: string, phone?: string) => void;
  recharge: (amount: number) => void;
  setStake: (stake: number) => void;
  selectOpponent: (opponent: Player) => void;
  resetBet: () => void;
  rollForMe: () => void;
  rollForOpponent: () => void;
  resolveWinner: () => void;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (onboardingCompleted: boolean) => void;
};

const initialPlayers: Player[] = [
  { username: '@Momo', balance: 3000 },
  { username: '@Lina', balance: 1200 },
  { username: '@Teddy', balance: 800 },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: undefined,
  users: {},
  players: initialPlayers,
  bet: { stake: 0 },
  onboardingCompleted: false,
  setOnboardingCompleted: (onboardingCompleted: boolean) => set({ onboardingCompleted }),
  loginOrRegister: (username, _password, phone) => {
    const users = { ...get().users };
    if (!users[username]) {
      users[username] = { username, balance: 0, phone };
    }
    set({ users, currentUser: users[username] });
  },

  recharge: (amount) => {
    const me = get().currentUser;
    if (!me || amount <= 0) return;
    const updated = { ...me, balance: me.balance + amount };
    const users = { ...get().users, [updated.username]: updated };
    set({ currentUser: updated, users });
  },

  setStake: (stake) => set((state) => ({ bet: { ...state.bet, stake } })),

  selectOpponent: (opponent) => set((state) => ({ bet: { ...state.bet, opponent } })),

  resetBet: () => set({ bet: { stake: 0, opponent: undefined, myRoll: undefined, opponentRoll: undefined, winner: undefined } }),

  rollForMe: () => set((state) => ({ bet: { ...state.bet, myRoll: Math.floor(Math.random() * 6) + 1 } })),

  rollForOpponent: () => set((state) => ({ bet: { ...state.bet, opponentRoll: Math.floor(Math.random() * 6) + 1 } })),

  resolveWinner: () => {
    const { bet, currentUser, players } = get();
    if (!currentUser || !bet.opponent || !bet.myRoll || !bet.opponentRoll) return;
    let winner: 'me' | 'opponent' | 'draw' = 'draw';
    if (bet.myRoll > bet.opponentRoll) winner = 'me';
    else if (bet.opponentRoll > bet.myRoll) winner = 'opponent';

    if (winner !== 'draw' && bet.stake > 0) {
      if (winner === 'me') {
        const me = { ...currentUser, balance: currentUser.balance + bet.stake };
        const oppIndex = players.findIndex((p) => p.username === bet.opponent!.username);
        const opp = oppIndex >= 0 ? { ...players[oppIndex], balance: Math.max(0, players[oppIndex].balance - bet.stake) } : bet.opponent!;
        const newPlayers = [...players];
        if (oppIndex >= 0) newPlayers[oppIndex] = opp;
        const users = { ...get().users, [me.username]: me };
        set({ currentUser: me, users, players: newPlayers, bet: { ...bet, winner } });
      } else {
        const me = { ...currentUser, balance: Math.max(0, currentUser.balance - bet.stake) };
        const oppIndex = players.findIndex((p) => p.username === bet.opponent!.username);
        const opp = oppIndex >= 0 ? { ...players[oppIndex], balance: players[oppIndex].balance + bet.stake } : bet.opponent!;
        const newPlayers = [...players];
        if (oppIndex >= 0) newPlayers[oppIndex] = opp;
        const users = { ...get().users, [me.username]: me };
        set({ currentUser: me, users, players: newPlayers, bet: { ...bet, winner } });
      }
    } else {
      set({ bet: { ...bet, winner } });
    }
  },
}));


