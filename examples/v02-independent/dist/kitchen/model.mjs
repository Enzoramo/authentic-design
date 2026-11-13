export const INGREDIENTS = Object.freeze([
  { id: 'arroz', name: 'Arroz', amount: 180, unit: 'g' },
  { id: 'cogumelos', name: 'Cogumelos', amount: 250, unit: 'g' },
  { id: 'caldo', name: 'Caldo de legumes', amount: 600, unit: 'ml' },
  { id: 'cebola', name: 'Cebola', amount: 1, unit: 'unidade', plural: 'unidades' },
  { id: 'alho', name: 'Alho', amount: 1, unit: 'dente', plural: 'dentes' },
  { id: 'azeite', name: 'Azeite', amount: 15, unit: 'ml' },
  { id: 'salsa', name: 'Salsa', amount: 5, unit: 'g' }
]);
export const STEPS = Object.freeze([
  { title: 'Preparar', text: 'Lave os cogumelos e corte-os em lâminas. Pique a cebola, o alho e a salsa. Separe o caldo.', time: '' },
  { title: 'Refogar', text: 'Aqueça o azeite num tacho. Junte a cebola e o alho. Mexa durante cerca de 3 minutos. Adicione os cogumelos e cozinhe mais 4 minutos.', time: '3 + 4 min' },
  { title: 'Cozinhar o arroz', text: 'Junte o arroz e mexa. Acrescente o caldo quente. Cozinhe em lume brando durante cerca de 15 minutos, mexendo de vez em quando e verificando a textura.', time: 'Cerca de 15 min' },
  { title: 'Finalizar', text: 'Retire do lume quando o arroz estiver no ponto desejado. Junte a salsa, deixe repousar 2 minutos e sirva.', time: '2 min de repouso' }
]);
export function initialState(servings = 2) {
  return { version: 1, servings: [2, 4, 6].includes(servings) ? servings : 2, checked: [], phase: 'gather', step: 0, completed: 0 };
}
export function normaliseState(value) {
  if (!value || typeof value !== 'object' || value.version !== 1) return initialState();
  const state = initialState(value.servings);
  state.checked = Array.isArray(value.checked) ? [...new Set(value.checked.filter(id => INGREDIENTS.some(ingredient => ingredient.id === id)))] : [];
  state.phase = ['gather', 'cook', 'done'].includes(value.phase) ? value.phase : 'gather';
  state.completed = Number.isInteger(value.completed) ? Math.max(0, Math.min(4, value.completed)) : 0;
  state.step = Number.isInteger(value.step) ? Math.max(0, Math.min(3, value.step, state.completed)) : 0;
  if (state.phase === 'gather') { state.step = 0; state.completed = 0; }
  if (state.phase === 'done') { state.step = 3; state.completed = 4; }
  return state;
}
export function quantities(servings) {
  const factor = ([2, 4, 6].includes(servings) ? servings : 2) / 2;
  return INGREDIENTS.map(ingredient => {
    const amount = ingredient.amount * factor;
    return { ...ingredient, amount, unit: amount > 1 && ingredient.plural ? ingredient.plural : ingredient.unit };
  });
}
export function updateState(state, action) {
  switch (action.type) {
    case 'servings': return { ...state, servings: [2, 4, 6].includes(action.value) ? action.value : state.servings };
    case 'ingredient': {
      if (!INGREDIENTS.some(ingredient => ingredient.id === action.id)) return state;
      return { ...state, checked: state.checked.includes(action.id) ? state.checked.filter(id => id !== action.id) : [...state.checked, action.id] };
    }
    case 'start': return state.phase === 'gather' ? { ...state, phase: 'cook' } : state;
    case 'advance': {
      if (state.phase !== 'cook') return state;
      const completed = Math.max(state.completed, state.step + 1);
      return { ...state, completed, step: Math.min(3, state.step + 1), phase: state.step === 3 ? 'done' : 'cook' };
    }
    case 'back': return state.phase === 'cook' ? { ...state, step: Math.max(0, state.step - 1) } : state;
    case 'visit': return state.phase !== 'gather' && Number.isInteger(action.step) && action.step >= 0 && action.step <= Math.min(state.completed, 3) ? { ...state, phase: 'cook', step: action.step } : state;
    case 'restart': return initialState(state.servings);
    default: return state;
  }
}
