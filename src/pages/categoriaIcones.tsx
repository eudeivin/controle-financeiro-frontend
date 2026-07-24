import {
  UtensilsCrossed,
  Car,
  Home,
  Banknote,
  ShoppingCart,
  Heart,
  GraduationCap,
  Gamepad2,
  Plane,
  Wifi,
  Dumbbell,
  PawPrint,
  Gift,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

interface IconeConfig {
  icon: LucideIcon;
  cor: string;
}

const mapaIcones: Record<string, IconeConfig> = {
  alimentacao: { icon: UtensilsCrossed, cor: 'text-orange-400' },
  comida: { icon: UtensilsCrossed, cor: 'text-orange-400' },
  mercado: { icon: ShoppingCart, cor: 'text-orange-400' },
  transporte: { icon: Car, cor: 'text-blue-400' },
  uber: { icon: Car, cor: 'text-blue-400' },
  casa: { icon: Home, cor: 'text-yellow-400' },
  moradia: { icon: Home, cor: 'text-yellow-400' },
  aluguel: { icon: Home, cor: 'text-yellow-400' },
  salario: { icon: Banknote, cor: 'text-green-400' },
  saude: { icon: Heart, cor: 'text-red-400' },
  educacao: { icon: GraduationCap, cor: 'text-purple-400' },
  estudo: { icon: GraduationCap, cor: 'text-purple-400' },
  lazer: { icon: Gamepad2, cor: 'text-pink-400' },
  jogos: { icon: Gamepad2, cor: 'text-pink-400' },
  viagem: { icon: Plane, cor: 'text-cyan-400' },
  internet: { icon: Wifi, cor: 'text-indigo-400' },
  academia: { icon: Dumbbell, cor: 'text-lime-400' },
  pet: { icon: PawPrint, cor: 'text-amber-400' },
  presente: { icon: Gift, cor: 'text-rose-400' },
};

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getIconePorCategoria(nomeCategoria: string): IconeConfig {
  const chave = normalizar(nomeCategoria);

  const encontrado = Object.keys(mapaIcones).find((k) => chave.includes(k));

  if (encontrado) {
    return mapaIcones[encontrado];
  }

  return { icon: Wallet, cor: 'text-gray-400' };
}