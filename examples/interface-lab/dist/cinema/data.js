window.CINEMA_DATA = {
  price: 6,
  films: {
    mare: { title: 'Maré baixa', genre: 'Ficção', duration: 92, language: 'Português', poster: 'assets/mare-baixa.svg', number: '01', theme: 'mare' },
    cidade: { title: 'A cidade que escuta', genre: 'Documentário', duration: 74, language: null, poster: 'assets/cidade-escuta.svg', number: '02', theme: 'cidade' },
    chuva: { title: 'Depois da chuva', genre: 'Animação', duration: 68, language: null, poster: 'assets/depois-chuva.svg', number: '03', theme: 'chuva' }
  },
  days: {
    thu: { label: 'Quinta-feira, 12 de novembro', short: 'Qui, 12 nov', date: '2026-11-12', sessions: [ { film: 'mare', time: '18:30' }, { film: 'cidade', time: '19:15' }, { film: 'mare', time: '21:00' } ] },
    fri: { label: 'Sexta-feira, 13 de novembro', short: 'Sex, 13 nov', date: '2026-11-13', sessions: [ { film: 'chuva', time: '17:00' }, { film: 'chuva', time: '19:00' }, { film: 'mare', time: '20:00' } ] },
    sat: { label: 'Sábado, 14 de novembro', short: 'Sáb, 14 nov', date: '2026-11-14', sessions: [ { film: 'chuva', time: '16:00' }, { film: 'cidade', time: '18:00' }, { film: 'mare', time: '21:00', soldOut: true } ] }
  }
};
