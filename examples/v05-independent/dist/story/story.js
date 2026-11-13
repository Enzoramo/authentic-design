/* Conteúdo e regras da narrativa. Sem dependências ou pedidos de rede. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VeredaStory = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const passages = {
    inicio: {
      title: 'Início',
      text: 'Ao voltar à estação da vila, Nina encontrou um envelope sem remetente. Dentro havia uma chave e a frase: antes que fechem as portas.',
      choices: [
        { label: 'Procurar no armário da estação', to: 'armario' },
        { label: 'Levar a chave a Tomás', to: 'tomas' }
      ]
    },
    armario: {
      title: 'Armário',
      text: 'A chave abriu um compartimento vazio, salvo por um mapa. Uma linha ligava a estação ao antigo reservatório.',
      choices: [
        { label: 'Seguir o mapa', to: 'reservatorio' },
        { label: 'Pedir ajuda a Tomás', to: 'tomas' }
      ]
    },
    tomas: {
      title: 'Tomás',
      text: 'Tomás reconheceu a chave. Sua irmã guardava ali as histórias que ninguém queria esquecer. Ela partira, mas deixara duas pistas.',
      choices: [
        { label: 'Ir ao reservatório', to: 'reservatorio' },
        { label: 'Ficar e ouvir a história', to: 'vozes' }
      ]
    },
    reservatorio: {
      title: 'Reservatório',
      text: 'A porta estava aberta. Lá dentro, caixas de fitas esperavam alguém que soubesse escutar.',
      choices: [
        { label: 'Levar as fitas para a vila', to: 'partilha' },
        { label: 'Catalogar as fitas ali mesmo', to: 'guardia' }
      ]
    },
    vozes: {
      title: 'Vozes',
      text: 'Nina ficou até anoitecer. Algumas viagens começavam quando alguém decidia ouvir.',
      choices: []
    },
    partilha: {
      title: 'Partilha',
      text: 'Na semana seguinte, a vila ouviu suas próprias vozes. O envelope ganhou muitos remetentes.',
      choices: []
    },
    guardia: {
      title: 'Guardiã',
      text: 'Nina anotou o primeiro nome. A estação podia fechar; a memória encontrara outro lugar.',
      choices: []
    }
  };
  const sizes = [100, 115, 130];
  const fresh = () => ({ version: 1, path: ['inicio'], size: 100, scroll: 0 });
  function normalize(value) {
    const state = fresh();
    if (!value || value.version !== 1) return state;
    if (sizes.includes(value.size)) state.size = value.size;
    const candidate = value.path;
    if (!Array.isArray(candidate) || candidate[0] !== 'inicio' || candidate.length > 7) return state;
    for (let index = 1; index < candidate.length; index += 1) {
      const previous = passages[state.path.at(-1)];
      if (!previous.choices.some(choice => choice.to === candidate[index])) break;
      state.path.push(candidate[index]);
    }
    if (Number.isFinite(value.scroll) && value.scroll >= 0) state.scroll = Math.min(value.scroll, 100000);
    return state;
  }
  function current(state) { return passages[state.path.at(-1)]; }
  function choose(state, destination) {
    if (!current(state).choices.some(choice => choice.to === destination)) return state;
    return { ...state, path: [...state.path, destination], scroll: 0 };
  }
  function back(state) {
    return state.path.length > 1 ? { ...state, path: state.path.slice(0, -1), scroll: 0 } : state;
  }
  function restart(state) { return { ...fresh(), size: state.size }; }
  return { passages, sizes, fresh, normalize, current, choose, back, restart };
});
