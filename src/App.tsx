import { useState, useEffect, useRef } from 'react';

// ==================== GAME DATA ====================
interface Saint {
  id: string;
  name: string;
  constellation: string;
  title: string;
  rarity: 'Bronze' | 'Silver' | 'Gold';
  hp: number;
  atk: number;
  def: number;
  spd: number;
  color: string;
  glow: string;
  symbol: string;
  technique: string;
  quote: string;
}

const ALL_SAINTS: Saint[] = [
  // Bronze
  { id: 'seiya', name: 'Seiya', constellation: 'Pegaso', title: 'El Santo de la Esperanza', rarity: 'Bronze', hp: 8500, atk: 1200, def: 700, spd: 180, color: 'from-sky-400 to-blue-600', glow: 'shadow-sky-500/60', symbol: '♄', technique: 'Puño Meteoro de Pegaso', quote: '¡Pegaso Ryusei Ken!' },
  { id: 'shiryu', name: 'Shiryu', constellation: 'Dragón', title: 'El Dragón de Rozan', rarity: 'Bronze', hp: 9500, atk: 1300, def: 1100, spd: 150, color: 'from-emerald-400 to-teal-700', glow: 'shadow-emerald-500/60', symbol: '☉', technique: 'Dragón Naciente de Rozan', quote: '¡Rozan Sho Ryu Ha!' },
  { id: 'hyoga', name: 'Hyoga', constellation: 'Cisne', title: 'El Santo de Hielo', rarity: 'Bronze', hp: 8000, atk: 1150, def: 750, spd: 160, color: 'from-cyan-300 to-blue-500', glow: 'shadow-cyan-400/60', symbol: '❄', technique: 'Polvo de Diamantes', quote: '¡Diamond Dust!' },
  { id: 'shun', name: 'Shun', constellation: 'Andrómeda', title: 'El Santo de las Cadenas', rarity: 'Bronze', hp: 8200, atk: 1000, def: 900, spd: 155, color: 'from-pink-400 to-rose-500', glow: 'shadow-pink-400/60', symbol: '⛓', technique: 'Cadena de Nebulosa', quote: '¡Nebula Chain!' },
  { id: 'ikki', name: 'Ikki', constellation: 'Fénix', title: 'El Ave Inmortal', rarity: 'Bronze', hp: 8800, atk: 1450, def: 800, spd: 170, color: 'from-orange-500 to-red-700', glow: 'shadow-orange-500/60', symbol: '🔥', technique: 'Ala del Fénix', quote: '¡Hoo Yoku Ten Sho!' },
  // Silver
  { id: 'marin', name: 'Marin', constellation: 'Águila', title: 'Águila Plateada', rarity: 'Silver', hp: 7500, atk: 1100, def: 650, spd: 175, color: 'from-indigo-300 to-violet-500', glow: 'shadow-indigo-400/60', symbol: '🦅', technique: 'Puño del Águila', quote: '¡Eagle Toe Flash!' },
  { id: 'shina', name: 'Shaina', constellation: 'Ofiuco', title: 'La Ofiuco Plateada', rarity: 'Silver', hp: 7800, atk: 1180, def: 700, spd: 172, color: 'from-emerald-300 to-green-600', glow: 'shadow-emerald-400/60', symbol: '🐍', technique: 'Garra del Trueno', quote: '¡Thunder Claw!' },
  // Gold
  { id: 'aiolia', name: 'Aiolia', constellation: 'Leo', title: 'Relámpago del Santuario', rarity: 'Gold', hp: 13000, atk: 1800, def: 1200, spd: 190, color: 'from-yellow-400 to-orange-600', glow: 'shadow-yellow-400/80', symbol: '♌', technique: 'Cápsula del Poder Relámpago', quote: '¡Lightning Plasma!' },
  { id: 'milo', name: 'Milo', constellation: 'Escorpio', title: 'La Aguja Escarlata', rarity: 'Gold', hp: 12500, atk: 1900, def: 1100, spd: 185, color: 'from-red-500 to-rose-800', glow: 'shadow-red-500/70', symbol: '♏', technique: 'Aguja Escarlata', quote: '¡Scarlet Needle!' },
  { id: 'camus', name: 'Camus', constellation: 'Acuario', title: 'El Mago de Hielo', rarity: 'Gold', hp: 12000, atk: 1700, def: 1300, spd: 170, color: 'from-cyan-300 to-blue-700', glow: 'shadow-cyan-400/70', symbol: '♒', technique: 'Ejecución de la Aurora', quote: '¡Aurora Execution!' },
  { id: 'shaka', name: 'Shaka', constellation: 'Virgo', title: 'El Hombre más Cercano a Dios', rarity: 'Gold', hp: 14000, atk: 2000, def: 1400, spd: 165, color: 'from-amber-300 to-yellow-600', glow: 'shadow-amber-400/80', symbol: '♍', technique: 'Tesoro del Cielo', quote: '¡Tenbu Horin!' },
  { id: 'saga', name: 'Saga', constellation: 'Géminis', title: 'El Patriarca', rarity: 'Gold', hp: 14500, atk: 2100, def: 1350, spd: 175, color: 'from-slate-300 to-gray-700', glow: 'shadow-slate-400/70', symbol: '♊', technique: 'Explosión Galáctica', quote: '¡Galaxian Explosion!' },
];

const ENEMIES = [
  { name: 'Santo Negro de Pegaso', hp: 6000, atk: 900, def: 500, symbol: '👤', color: 'from-gray-600 to-black', technique: 'Puño Oscuro' },
  { name: 'Cassios', hp: 8000, atk: 1100, def: 700, symbol: '🗿', color: 'from-stone-500 to-stone-800', technique: 'Golpe Brutal' },
  { name: 'Jamian del Cuervo', hp: 9500, atk: 1200, def: 600, symbol: '🦅', color: 'from-slate-600 to-slate-900', technique: 'Cóctel del Cuervo' },
  { name: 'Santo de Oro Falso (Arles)', hp: 15000, atk: 1500, def: 1000, symbol: '👺', color: 'from-purple-700 to-indigo-900', technique: 'Onda Demoníaca' },
];

// ==================== UTILITIES ====================
const rarityColors: Record<string, string> = {
  Bronze: 'border-amber-700 bg-amber-900/20 text-amber-300',
  Silver: 'border-slate-300 bg-slate-200/10 text-slate-200',
  Gold: 'border-yellow-400 bg-yellow-400/10 text-yellow-300',
};

function getRandomSaint(pityCount: number): Saint {
  // Pity system: after 9 rolls, guaranteed gold
  if (pityCount >= 9) return ALL_SAINTS.filter(s => s.rarity === 'Gold')[Math.floor(Math.random() * 5)];
  const r = Math.random();
  if (r < 0.05) {
    // 5% Gold
    const golds = ALL_SAINTS.filter(s => s.rarity === 'Gold');
    return golds[Math.floor(Math.random() * golds.length)];
  } else if (r < 0.25) {
    // 20% Silver
    const silvers = ALL_SAINTS.filter(s => s.rarity === 'Silver');
    return silvers[Math.floor(Math.random() * silvers.length)];
  } else {
    // 75% Bronze
    const bronzes = ALL_SAINTS.filter(s => s.rarity === 'Bronze');
    return bronzes[Math.floor(Math.random() * bronzes.length)];
  }
}

// ==================== SCREENS ====================

type Screen = 'menu' | 'summon' | 'roster' | 'battle' | 'story';

// ---- BATTLE LOGIC ----
interface BattleState {
  player: { saint: Saint; hp: number; maxHp: number; energy: number } | null;
  enemy: { name: string; hp: number; maxHp: number; atk: number; def: number; symbol: string; color: string; technique: string } | null;
  log: string[];
  turn: 'player' | 'enemy';
  over: boolean;
  victory: boolean;
  busy: boolean;
  animation: string | null; // for big attacks
  enemyIndex: number;
}

// ---- MAIN APP ----
export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [gems, setGems] = useState(30);
  const [coins, setCoins] = useState(50000);
  const [stamina, setStamina] = useState(50);
  const maxStamina = 50;
  const [ownedSaints, setOwnedSaints] = useState<Saint[]>([ALL_SAINTS[0], ALL_SAINTS[1], ALL_SAINTS[2], ALL_SAINTS[3], ALL_SAINTS[4]]);
  const [selectedSaint, setSelectedSaint] = useState<Saint | null>(ALL_SAINTS[0]);
  const [pityCount, setPityCount] = useState(0);

  // Stamina regen
  useEffect(() => {
    const t = setInterval(() => setStamina(s => Math.min(maxStamina, s + 1)), 8000);
    return () => clearInterval(t);
  }, []);

  const addSaint = (s: Saint) => {
    setOwnedSaints(prev => {
      if (prev.find(p => p.id === s.id)) return prev;
      return [...prev, s];
    });
  };

  return (
    <div className="relative min-h-screen cosmos-gradient text-white overflow-hidden">
      <div className="absolute inset-0 starfield opacity-40 pointer-events-none" />

      {/* Top bar (in-game) */}
      {screen !== 'battle' && (
        <TopBar gems={gems} coins={coins} stamina={stamina} maxStamina={maxStamina} screen={screen} setScreen={setScreen} />
      )}

      <div className="relative z-10">
        {screen === 'menu' && <MenuScreen setScreen={setScreen} />}
        {screen === 'story' && <StoryScreen setScreen={setScreen} setGems={setGems} setCoins={setCoins} setStamina={setStamina} stamina={stamina} selectedSaint={selectedSaint} />}
        {screen === 'summon' && (
          <SummonScreen
            gems={gems}
            setGems={setGems}
            addSaint={addSaint}
            pityCount={pityCount}
            setPityCount={setPityCount}
          />
        )}
        {screen === 'roster' && (
          <RosterScreen
            ownedSaints={ownedSaints}
            selectedSaint={selectedSaint}
            setSelectedSaint={setSelectedSaint}
          />
        )}
        {screen === 'battle' && (
          <BattleScreen
            playerSaint={selectedSaint}
            enemyIndex={0}
            setScreen={setScreen}
            setCoins={setCoins}
            setGems={setGems}
          />
        )}
      </div>
    </div>
  );
}

// ==================== TOP BAR ====================
function TopBar({ gems, coins, stamina, maxStamina, screen, setScreen }: any) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 bg-cosmos-900/90 backdrop-blur-md border-b border-yellow-600/30 px-4 py-2">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 flex-wrap">
          <button onClick={() => setScreen('menu')} className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-amber-700 flex items-center justify-center shadow-md shadow-yellow-500/40">
              <span className="font-cinzel font-black text-cosmos-900 text-sm">SS</span>
            </div>
            <span className="font-cinzel font-bold gold-text hidden sm:block text-sm">AWAKENING</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <ResourceBadge icon="⚡" value={stamina} max={maxStamina} color="text-yellow-300" />
            <ResourceBadge icon="💎" value={gems} color="text-cyan-300" />
            <ResourceBadge icon="🪙" value={coins >= 1000 ? `${(coins / 1000).toFixed(0)}K` : coins} color="text-amber-300" />
          </div>
        </div>
      </div>
      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-cosmos-900/95 backdrop-blur-md border-t border-yellow-600/30 px-2 py-2">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-1">
          {[
            { id: 'menu', icon: '🏠', label: 'Inicio' },
            { id: 'story', icon: '📜', label: 'Historia' },
            { id: 'summon', icon: '✨', label: 'Invocar' },
            { id: 'roster', icon: '👥', label: 'Santos' },
          ].map(nav => (
            <button
              key={nav.id}
              onClick={() => setScreen(nav.id)}
              className={`flex flex-col items-center py-2 rounded-lg transition-all ${
                screen === nav.id
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'text-slate-400 hover:text-yellow-300'
              }`}
            >
              <span className="text-xl">{nav.icon}</span>
              <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">{nav.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function ResourceBadge({ icon, value, max, color }: any) {
  return (
    <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-full px-2.5 py-1">
      <span className="text-sm">{icon}</span>
      <span className={`font-bold text-xs ${color}`}>
        {value}{max ? `/${max}` : ''}
      </span>
    </div>
  );
}

// ==================== MENU ====================
function MenuScreen({ setScreen }: any) {
  const [cosmos, setCosmos] = useState(0);
  const [burning, setBurning] = useState(false);

  const handleBurn = () => {
    if (burning) return;
    setBurning(true);
    const interval = setInterval(() => {
      setCosmos(c => {
        if (c >= 100) {
          clearInterval(interval);
          setTimeout(() => { setCosmos(0); setBurning(false); }, 2000);
          return 100;
        }
        return c + 2;
      });
    }, 30);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 text-[10px] font-bold tracking-widest mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
          MÓVIL · INSTALABLE COMO APP
        </div>
        <h1 className="font-cinzel font-black text-5xl sm:text-7xl leading-none">
          <span className="block gold-text tracking-wider">SAINT SEIYA</span>
          <span className="block text-2xl sm:text-3xl mt-2 font-cinzel font-bold tracking-[0.2em] text-white/90">AWAKENING</span>
        </h1>
      </div>

      {/* Seiya orb */}
      <div className="relative mb-6">
        <div className="w-48 h-48 sm:w-60 sm:h-60 rounded-full cloth-base gold-border flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-600/10" />
          <div className="absolute inset-8 rounded-full bg-yellow-400/10 blur-2xl" />
          <span className="text-8xl sm:text-9xl relative z-10 animate-float">♄</span>
        </div>
        <div className="absolute -inset-4 rounded-full bg-yellow-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Burn cosmos */}
      <button
        onClick={handleBurn}
        className={`relative px-8 py-3 rounded-full font-cinzel font-bold tracking-wider mb-3 transition-all ${
          burning
            ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white scale-105 shadow-2xl shadow-yellow-400/60'
            : 'bg-gradient-to-r from-yellow-500 to-amber-600 text-cosmos-900 hover:scale-105 shadow-lg shadow-yellow-600/50'
        }`}
      >
        ¡QUEMA TU COSMOS!
      </button>
      {cosmos > 0 && (
        <div className="w-56 h-2 bg-cosmos-800 rounded-full overflow-hidden border border-yellow-500/30 mb-2">
          <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all" style={{ width: `${cosmos}%` }} />
        </div>
      )}
      {cosmos === 100 && (
        <p className="text-yellow-400 font-cinzel font-bold animate-burn tracking-wider text-sm mb-2">¡SÉPTIMO SENTIDO!</p>
      )}

      <p className="text-slate-400 text-sm mb-8 max-w-xs text-center italic">
        "Un Santo no necesita armas... sólo su cosmos."
      </p>

      {/* Quick actions */}
      <div className="w-full max-w-md space-y-3 px-4">
        <button
          onClick={() => setScreen('story')}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-600 text-cosmos-900 font-cinzel font-bold tracking-wider text-lg shadow-lg shadow-yellow-600/40 hover:shadow-yellow-500/60 hover:scale-[1.02] transition-all"
        >
          ⚔️ COMENZAR AVENTURA
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setScreen('summon')}
            className="py-3 rounded-xl bg-cosmos-800/80 border border-yellow-500/30 text-yellow-300 font-bold hover:bg-cosmos-700 transition-all text-sm"
          >
            ✨ INVOCAR
          </button>
          <button
            onClick={() => setScreen('roster')}
            className="py-3 rounded-xl bg-cosmos-800/80 border border-white/10 text-slate-200 font-bold hover:bg-cosmos-700 transition-all text-sm"
          >
            👥 MIS SANTOS
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
          📱 Esta web-app se puede instalar en Android desde el navegador ("Añadir a pantalla de inicio") para funcionar como una app nativa.
        </p>
      </div>
    </div>
  );
}

// ==================== STORY / LEVEL SELECT ====================
function StoryScreen({ setScreen, setGems, setCoins, setStamina, stamina, selectedSaint }: any) {
  const chapters = [
    { id: 0, name: 'Capítulo 1', title: 'El Torneo Galáctico', desc: 'Enfrenta al Santo Negro de Pegaso', cost: 5, rewardCoins: 5000, rewardGems: 10, enemy: ENEMIES[0], unlocked: true },
    { id: 1, name: 'Capítulo 2', title: 'Las Mil Dagas', desc: 'Cassios te desafía en el ring', cost: 7, rewardCoins: 7500, rewardGems: 15, enemy: ENEMIES[1], unlocked: true },
    { id: 2, name: 'Capítulo 3', title: 'Los Santos Negros', desc: 'Jamian del Cuervo acecha', cost: 10, rewardCoins: 10000, rewardGems: 20, enemy: ENEMIES[2], unlocked: true },
    { id: 3, name: 'Capítulo 4', title: 'Las Doce Casas', desc: 'El Patriarca te espera', cost: 15, rewardCoins: 20000, rewardGems: 50, enemy: ENEMIES[3], unlocked: true },
  ];
  const [selected, setSelected] = useState(chapters[0]);
  const [battleStart, setBattleStart] = useState(false);

  const startBattle = () => {
    if (!selectedSaint) {
      alert('Selecciona un Santo primero en la pestaña "Santos"');
      return;
    }
    if (stamina < selected.cost) {
      alert('¡No tienes suficiente energía! Recupera con el tiempo o compra más.');
      return;
    }
    setStamina((s: number) => s - selected.cost);
    setBattleStart(true);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pt-4">
          <p className="text-yellow-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">Modo Historia</p>
          <h2 className="font-cinzel font-black text-3xl md:text-4xl gold-text">SANTUARIO</h2>
        </div>

        {battleStart ? (
          <BattleScreen
            playerSaint={selectedSaint}
            enemyIndex={selected.id}
            setScreen={(s: Screen) => {
              setBattleStart(false);
              if (s === 'menu') setScreen('menu');
            }}
            setCoins={setCoins}
            setGems={setGems}
            rewardCoins={selected.rewardCoins}
            rewardGems={selected.rewardGems}
            onExit={() => setBattleStart(false)}
          />
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {chapters.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setSelected(ch)}
                  className={`text-left p-5 rounded-2xl border transition-all ${
                    selected.id === ch.id
                      ? 'gold-border bg-cosmos-800/80 scale-[1.02]'
                      : 'border-yellow-600/20 bg-cosmos-800/40 hover:border-yellow-500/40'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${ch.enemy.color} flex items-center justify-center text-3xl shrink-0`}>
                      {ch.enemy.symbol}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold tracking-widest text-yellow-400/70">{ch.name}</span>
                        <span className="text-[10px] text-slate-500">· {ch.cost}⚡</span>
                      </div>
                      <h3 className="font-cinzel font-bold text-lg text-white">{ch.title}</h3>
                      <p className="text-xs text-slate-400 mt-1">{ch.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Details card */}
            <div className="cloth-base gold-border rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${selected.enemy.color} flex items-center justify-center text-5xl shrink-0`}>
                  {selected.enemy.symbol}
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest text-yellow-400 mb-1">{selected.name}</p>
                  <h3 className="font-cinzel font-black text-2xl gold-text">{selected.enemy.name}</h3>
                  <p className="text-xs text-slate-400 italic">"{selected.enemy.technique}"</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <Stat label="HP" val={selected.enemy.hp} />
                <Stat label="ATK" val={selected.enemy.atk} />
                <Stat label="DEF" val={selected.enemy.def} />
              </div>

              <div className="flex items-center justify-between bg-black/30 rounded-xl p-3 mb-4">
                <span className="text-xs text-slate-400 uppercase tracking-wider">Recompensas:</span>
                <div className="flex gap-3 text-sm">
                  <span className="text-amber-300 font-bold">🪙 {selected.rewardCoins.toLocaleString()}</span>
                  <span className="text-cyan-300 font-bold">💎 {selected.rewardGems}</span>
                </div>
              </div>

              <button
                onClick={startBattle}
                disabled={stamina < selected.cost || !selectedSaint}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-cinzel font-bold tracking-wider hover:from-red-400 hover:to-orange-500 transition-all shadow-lg shadow-red-600/40 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ⚔️ COMENZAR BATALLA ({selected.cost}⚡)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, val }: { label: string; val: number }) {
  return (
    <div className="bg-black/30 rounded-lg p-2 text-center border border-yellow-500/10">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{label}</div>
      <div className="font-cinzel font-bold text-yellow-300 text-lg">{val}</div>
    </div>
  );
}

// ==================== SUMMON ====================
function SummonScreen({ gems, setGems, addSaint, pityCount, setPityCount }: any) {
  const [rolling, setRolling] = useState(false);
  const [results, setResults] = useState<Saint[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const doSummon = (count: number) => {
    const cost = count === 1 ? 5 : 45; // 10-pull discount
    if (gems < cost) {
      alert('¡No tienes suficientes gemas! Completa misiones para conseguir más.');
      return;
    }
    setGems((g: number) => g - cost);
    setRolling(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer);
          // Generate pulls
          const pulled: Saint[] = [];
          let currentPity = pityCount;
          for (let i = 0; i < count; i++) {
            const saint = getRandomSaint(currentPity);
            pulled.push(saint);
            if (saint.rarity === 'Gold') currentPity = 0;
            else currentPity++;
          }
          setPityCount(currentPity);
          pulled.forEach(addSaint);
          setResults(pulled);
          setRolling(false);
          setShowResults(true);
          return 0;
        }
        return c - 1;
      });
    }, 700);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto pt-4">
        <div className="text-center mb-6">
          <p className="text-yellow-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">Invocación Cósmica</p>
          <h2 className="font-cinzel font-black text-3xl md:text-4xl gold-text">PORTAL DE LAS CONSTELACIONES</h2>
        </div>

        {showResults ? (
          <SummonResults results={results} onClose={() => setShowResults(false)} />
        ) : (
          <>
            {/* Summon circle */}
            <div className="relative mx-auto w-full max-w-md aspect-square mb-8">
              <div className={`absolute inset-0 rounded-full cloth-base gold-border flex items-center justify-center ${rolling ? 'animate-pulse-glow' : ''}`}>
                {/* Rotating ring */}
                <div
                  className="absolute inset-4 rounded-full border-2 border-dashed border-yellow-500/40"
                  style={{ animation: rolling ? 'spin 3s linear infinite' : 'spin 20s linear infinite' }}
                />
                <div
                  className="absolute inset-8 rounded-full border border-yellow-300/30"
                  style={{ animation: rolling ? 'spin 2s linear infinite reverse' : 'spin 15s linear infinite reverse' }}
                />

                {/* Zodiac symbols around */}
                {['♈','♉','♊','♋','♌','♍','⚖','♏','♐','♑','♒','♓'].map((s, i) => (
                  <div
                    key={i}
                    className="absolute text-yellow-400/70 font-bold text-lg"
                    style={{
                      top: `${50 - 46 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                      left: `${50 + 46 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {s}
                  </div>
                ))}

                <div className="relative z-10 text-center">
                  {rolling ? (
                    <>
                      <div className="text-6xl mb-2 animate-burn">✨</div>
                      <div className="font-cinzel font-black text-4xl gold-text">{countdown}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-8xl mb-3 animate-float">🌌</div>
                      <p className="font-cinzel font-bold text-yellow-300 tracking-widest text-sm">INVOCAR</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Pity */}
            <div className="text-center mb-4">
              <p className="text-xs text-slate-400">
                Invocaciones hasta Oro garantizado: <span className="text-yellow-300 font-bold">{10 - pityCount}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Probabilidades: 5% Oro · 20% Plata · 75% Bronce</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <button
                onClick={() => doSummon(1)}
                disabled={rolling || gems < 5}
                className="py-4 rounded-2xl bg-gradient-to-b from-yellow-500 to-amber-700 text-cosmos-900 font-cinzel font-bold shadow-lg shadow-yellow-600/40 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="text-lg">SIMPLE</div>
                <div className="text-xs flex items-center justify-center gap-1 mt-1">
                  <span>💎</span> 5
                </div>
              </button>
              <button
                onClick={() => doSummon(10)}
                disabled={rolling || gems < 45}
                className="relative py-4 rounded-2xl bg-gradient-to-b from-red-500 to-orange-700 text-white font-cinzel font-bold shadow-lg shadow-red-600/40 hover:scale-[1.02] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-cosmos-900 text-[9px] font-black px-2 py-0.5 rounded-full tracking-widest">
                  +1 ORO GARANTIZADO
                </div>
                <div className="text-lg">x10</div>
                <div className="text-xs flex items-center justify-center gap-1 mt-1">
                  <span>💎</span> 45 <span className="line-through text-white/50 ml-1">50</span>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SummonResults({ results, onClose }: { results: Saint[]; onClose: () => void }) {
  const [revealed, setRevealed] = useState<number>(-1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (showAll) return;
    if (revealed >= results.length - 1) return;
    const t = setTimeout(() => setRevealed(r => r + 1), 250);
    return () => clearTimeout(t);
  }, [revealed, showAll, results.length]);

  const hasGold = results.some(r => r.rarity === 'Gold');
  const hasSilver = results.some(r => r.rarity === 'Silver');

  return (
    <div>
      {hasGold && (
        <div className="text-center mb-4">
          <p className="font-cinzel font-black text-2xl md:text-3xl gold-text animate-burn">¡SANTO DE ORO!</p>
        </div>
      )}
      {!hasGold && hasSilver && (
        <div className="text-center mb-4">
          <p className="font-cinzel font-bold text-lg text-slate-300">✨ ¡Santo de Plata obtenido!</p>
        </div>
      )}

      <div className={`grid gap-3 mb-6 ${results.length > 1 ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-1 max-w-xs mx-auto'}`}>
        {results.map((s, i) => {
          const shown = showAll || i <= revealed;
          return (
            <div
              key={i}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all duration-500 ${
                shown ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              } ${
                s.rarity === 'Gold' ? 'border-yellow-400 shadow-xl shadow-yellow-400/50' :
                s.rarity === 'Silver' ? 'border-slate-300 shadow-lg shadow-slate-400/40' :
                'border-amber-700'
              } bg-gradient-to-br ${s.color}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center text-6xl drop-shadow-lg">
                {shown ? s.symbol : '❓'}
              </div>
              {shown && (
                <div className="absolute inset-x-0 bottom-0 p-2 text-center bg-black/60">
                  <div className={`text-[9px] font-black tracking-widest uppercase ${
                    s.rarity === 'Gold' ? 'text-yellow-300' :
                    s.rarity === 'Silver' ? 'text-slate-200' : 'text-amber-400'
                  }`}>{s.rarity}</div>
                  <div className="font-cinzel font-bold text-white text-sm leading-tight">{s.name}</div>
                  <div className="text-[10px] text-slate-300">{s.constellation}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        {!showAll && revealed < results.length - 1 && (
          <button
            onClick={() => setShowAll(true)}
            className="flex-1 py-3 rounded-xl bg-cosmos-800 border border-yellow-500/30 text-yellow-300 font-bold hover:bg-cosmos-700 transition-all text-sm"
          >
            SALTAR ANIMACIÓN
          </button>
        )}
        <button
          onClick={onClose}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-cosmos-900 font-cinzel font-bold hover:scale-[1.02] transition-all"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
}

// ==================== ROSTER ====================
function RosterScreen({ ownedSaints, selectedSaint, setSelectedSaint }: any) {
  return (
    <div className="min-h-screen pt-20 pb-24 px-4">
      <div className="max-w-5xl mx-auto pt-4">
        <div className="text-center mb-6">
          <p className="text-yellow-400 text-xs font-bold tracking-[0.3em] uppercase mb-2">Mi Equipo</p>
          <h2 className="font-cinzel font-black text-3xl md:text-4xl gold-text">SANTOS</h2>
          <p className="text-xs text-slate-400 mt-2">{ownedSaints.length} Santos desbloqueados</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {ownedSaints.map((s: Saint) => {
            const isSelected = selectedSaint?.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSaint(s)}
                className={`relative rounded-xl overflow-hidden transition-all ${
                  isSelected ? 'ring-2 ring-yellow-400 scale-105 shadow-xl shadow-yellow-400/30' : 'card-glow'
                } border ${rarityColors[s.rarity].split(' ')[0]} bg-gradient-to-br ${s.color} aspect-[3/4]`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center text-5xl drop-shadow-lg">
                  {s.symbol}
                </div>
                <div className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest ${rarityColors[s.rarity]}`}>
                  {s.rarity === 'Gold' ? '★★★' : s.rarity === 'Silver' ? '★★' : '★'}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2 text-center bg-black/70">
                  <div className="font-cinzel font-bold text-white text-sm leading-tight">{s.name}</div>
                  <div className="text-[10px] text-slate-300">{s.constellation}</div>
                </div>
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-cosmos-900 text-[10px] font-black">✓</div>
                )}
              </button>
            );
          })}
        </div>

        {selectedSaint && (
          <div className="mt-8 cloth-base gold-border rounded-2xl p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className={`w-32 h-40 rounded-xl bg-gradient-to-br ${selectedSaint.color} flex items-center justify-center text-7xl shrink-0 shadow-xl ${selectedSaint.glow}`}>
                {selectedSaint.symbol}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className={`inline-block px-2 py-0.5 rounded text-[10px] font-black tracking-widest mb-2 ${rarityColors[selectedSaint.rarity]}`}>
                  SANTO DE {selectedSaint.rarity.toUpperCase()}
                </div>
                <h3 className="font-cinzel font-black text-3xl gold-text">{selectedSaint.name}</h3>
                <p className="text-yellow-400/80 text-sm mb-1">Constelación de {selectedSaint.constellation}</p>
                <p className="text-slate-400 text-sm italic mb-3">"{selectedSaint.title}"</p>
                <p className="text-slate-300 text-sm mb-4">Técnica especial: <span className="text-yellow-300 font-semibold">{selectedSaint.technique}</span></p>
                <div className="grid grid-cols-4 gap-2">
                  <Stat label="HP" val={selectedSaint.hp} />
                  <Stat label="ATK" val={selectedSaint.atk} />
                  <Stat label="DEF" val={selectedSaint.def} />
                  <Stat label="SPD" val={selectedSaint.spd} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== BATTLE ====================
function BattleScreen({ playerSaint, enemyIndex, setScreen, setCoins, setGems, rewardCoins = 5000, rewardGems = 10, onExit }: any) {
  const enemy = ENEMIES[enemyIndex];
  const [state, setState] = useState<BattleState>({
    player: playerSaint ? { saint: playerSaint, hp: playerSaint.hp, maxHp: playerSaint.hp, energy: 2 } : null,
    enemy: { ...enemy, maxHp: enemy.hp },
    log: [`¡${enemy.name} aparece!`, `¡${playerSaint.name} se prepara para luchar!`],
    turn: playerSaint.spd >= enemy.atk * 0.1 ? 'player' : 'enemy',
    over: false,
    victory: false,
    busy: false,
    animation: null,
    enemyIndex,
  });
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.log]);

  const addLog = (msg: string) => {
    setState(s => ({ ...s, log: [...s.log, msg] }));
  };

  const playerAttack = (type: 'normal' | 'special') => {
    if (state.busy || state.over || state.turn !== 'player') return;
    if (type === 'special' && state.player!.energy < 2) {
      addLog('¡No tienes suficiente energía (2⚡)!');
      return;
    }

    setState(s => ({ ...s, busy: true, animation: type === 'special' ? 'special' : 'attack' }));

    setTimeout(() => {
      const p = state.player!;
      const e = state.enemy!;
      let dmg: number;
      let msg: string;
      if (type === 'normal') {
        dmg = Math.max(50, p.saint.atk - e.def / 2 + Math.floor(Math.random() * 300));
        msg = `¡${p.saint.name} ataca por ${dmg} de daño!`;
      } else {
        dmg = Math.max(200, Math.floor(p.saint.atk * 1.8) - e.def / 3 + Math.floor(Math.random() * 500));
        msg = `¡${p.saint.quote} ${p.saint.technique}! -${dmg} daño!`;
      }
      const newEnemyHp = Math.max(0, e.hp - dmg);
      const newEnergy = type === 'special' ? p.energy - 2 : Math.min(4, p.energy + 1);

      setState(s => ({
        ...s,
        player: { ...s.player!, energy: newEnergy },
        enemy: { ...s.enemy!, hp: newEnemyHp },
        log: [...s.log, msg],
      }));

      setTimeout(() => {
        if (newEnemyHp <= 0) {
          setState(s => ({
            ...s,
            over: true,
            victory: true,
            busy: false,
            animation: null,
            log: [...s.log, `¡${enemy.name} ha sido derrotado!`, `¡VICTORIA!`],
          }));
        } else {
          setState(s => ({ ...s, turn: 'enemy', busy: false, animation: null }));
          setTimeout(enemyTurn, 1000);
        }
      }, 600);
    }, 800);
  };

  const playerDefend = () => {
    if (state.busy || state.over || state.turn !== 'player') return;
    setState(s => ({ ...s, busy: true }));
    addLog(`¡${state.player!.saint.name} se pone en guardia y recupera energía!`);
    setState(s => ({
      ...s,
      player: { ...s.player!, energy: Math.min(4, s.player!.energy + 2) },
      turn: 'enemy',
      busy: false,
    }));
    setTimeout(enemyTurn, 900);
  };

  const enemyTurn = () => {
    setState(s => {
      if (s.over || !s.player || !s.enemy) return s;
      const e = s.enemy;
      const p = s.player;
      const dmg = Math.max(50, e.atk - p.saint.def / 2 + Math.floor(Math.random() * 250));
      const newHp = Math.max(0, p.hp - dmg);
      const newLog = [...s.log, `¡${e.name} usa ${e.technique}! -${dmg} de daño a ${p.saint.name}.`];
      if (newHp <= 0) {
        return {
          ...s,
          player: { ...p, hp: 0 },
          over: true,
          victory: false,
          busy: false,
          log: [...newLog, `¡${p.saint.name} ha caído!`, `DERROTA...`],
          animation: null,
        };
      }
      setTimeout(() => {
        setState(st => ({ ...st, turn: 'player', player: { ...st.player!, energy: Math.min(4, st.player!.energy + 1) } }));
      }, 500);
      return {
        ...s,
        player: { ...p, hp: newHp },
        log: newLog,
      };
    });
  };

  const claimRewards = () => {
    if (state.victory) {
      setCoins((c: number) => c + rewardCoins);
      setGems((g: number) => g + rewardGems);
    }
    if (onExit) onExit();
    else setScreen('menu');
  };

  if (!state.player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">No hay Santo seleccionado.</p>
      </div>
    );
  }

  const p = state.player;
  const e = state.enemy!;

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-b from-cosmos-800 via-cosmos-900 to-black">
      <div className="absolute inset-0 starfield opacity-40" />

      {/* Battle arena */}
      <div className="flex-1 relative flex flex-col justify-between px-4 py-6">
        {/* Enemy */}
        <div className="relative z-10 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] text-red-400 font-bold tracking-widest uppercase">Enemigo</p>
              <h3 className="font-cinzel font-bold text-xl text-white">{e.name}</h3>
            </div>
            <div className="text-3xl">{e.symbol}</div>
          </div>
          <HealthBar current={e.hp} max={e.maxHp} color="from-red-500 to-red-700" label="HP" />
        </div>

        {/* Battle arena visuals */}
        <div className="relative flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-xl relative">
            {/* Enemy visual */}
            <div className="flex justify-end mb-8">
              <div className={`relative ${state.animation === 'special' || state.animation === 'attack' ? 'animate-burn' : ''}`}>
                <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br ${e.color} flex items-center justify-center text-7xl shadow-2xl border-2 border-red-500/40 ${e.hp <= 0 ? 'grayscale opacity-40 rotate-12' : ''}`}>
                  {e.symbol}
                </div>
                <div className="absolute -inset-3 rounded-2xl bg-red-500/20 blur-2xl" />
              </div>
            </div>

            {/* Versus line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />

            {/* Player visual */}
            <div className="flex justify-start">
              <div className={`relative`}>
                <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br ${p.saint.color} flex items-center justify-center text-7xl shadow-2xl border-2 border-yellow-400/60 ${p.hp <= 0 ? 'grayscale opacity-40 -rotate-12' : ''} ${state.turn === 'player' && !state.busy && !state.over ? 'animate-pulse-glow' : ''}`}>
                  {p.saint.symbol}
                </div>
                <div className={`absolute -inset-3 rounded-2xl blur-2xl ${state.animation === 'special' ? 'bg-yellow-400/40' : 'bg-yellow-500/10'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Player */}
        <div className="relative z-10 max-w-md mx-auto w-full mb-3">
          <HealthBar current={p.hp} max={p.maxHp} color="from-emerald-400 to-green-600" label={`${p.saint.name} (${p.saint.constellation})`} />
          {/* Energy */}
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[10px] text-yellow-400 font-bold tracking-widest uppercase mr-1">Energía:</span>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-5 h-5 rounded-full border ${i < p.energy ? 'bg-yellow-400 border-yellow-300 shadow-md shadow-yellow-400/50' : 'bg-cosmos-800 border-yellow-500/20'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Battle log */}
      <div
        ref={logRef}
        className="bg-black/60 backdrop-blur-sm border-y border-yellow-600/20 max-h-28 overflow-y-auto px-4 py-2 text-xs space-y-0.5"
      >
        {state.log.slice(-6).map((l, i) => (
          <div key={i} className={`${i === state.log.slice(-6).length - 1 ? 'text-yellow-300' : 'text-slate-400'}`}>
            ▸ {l}
          </div>
        ))}
      </div>

      {/* Actions */}
      {!state.over ? (
        <div className="bg-cosmos-900/95 backdrop-blur-md border-t border-yellow-600/30 p-3 grid grid-cols-3 gap-2">
          <button
            onClick={() => playerAttack('normal')}
            disabled={state.turn !== 'player' || state.busy}
            className="py-3 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-500/40 text-white font-cinzel font-bold text-sm hover:from-slate-600 hover:to-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⚔️ ATACAR
          </button>
          <button
            onClick={() => playerAttack('special')}
            disabled={state.turn !== 'player' || state.busy || p.energy < 2}
            className="py-3 rounded-xl bg-gradient-to-b from-yellow-500 to-red-600 text-white font-cinzel font-bold text-sm hover:from-yellow-400 hover:to-red-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-yellow-600/30"
          >
            ✨ TÉCNICA (2⚡)
          </button>
          <button
            onClick={playerDefend}
            disabled={state.turn !== 'player' || state.busy}
            className="py-3 rounded-xl bg-gradient-to-b from-blue-600 to-blue-900 text-white font-cinzel font-bold text-sm hover:from-blue-500 hover:to-blue-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🛡️ DEFENSA
          </button>
        </div>
      ) : (
        <div className="bg-cosmos-900/95 backdrop-blur-md border-t border-yellow-600/30 p-6 text-center">
          <h3 className={`font-cinzel font-black text-3xl mb-2 ${state.victory ? 'gold-text' : 'text-red-500'}`}>
            {state.victory ? '¡VICTORIA!' : 'DERROTA'}
          </h3>
          {state.victory && (
            <div className="flex justify-center gap-4 mb-4 text-sm">
              <span className="text-amber-300 font-bold">🪙 +{rewardCoins.toLocaleString()}</span>
              <span className="text-cyan-300 font-bold">💎 +{rewardGems}</span>
            </div>
          )}
          <button
            onClick={claimRewards}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-cosmos-900 font-cinzel font-bold hover:scale-105 transition-all shadow-lg shadow-yellow-600/40"
          >
            CONTINUAR
          </button>
        </div>
      )}
    </div>
  );
}

function HealthBar({ current, max, color, label }: { current: number; max: number; color: string; label: string }) {
  const pct = (current / max) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider">{label}</span>
        <span className="text-[11px] font-mono text-white/80">{current.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div className="h-3 bg-black/60 rounded-full overflow-hidden border border-white/10">
        <div
          className={`h-full bg-gradient-to-r ${color} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
