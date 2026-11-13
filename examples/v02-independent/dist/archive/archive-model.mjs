export const records = [
  {id:'VB-01',title:'A última noite da oficina',speaker:'Rosa Matos',recorded:'2024-03-18',topic:'Trabalho',transcript:'Às seis, o relógio da oficina deixava de importar. Ficávamos a acabar as bainhas e alguém punha o rádio. No último dia levei a tesoura, mas deixei o banco onde me sentava. Ainda passei por lá durante meses, como se tivesse uma encomenda para levantar.'},
  {id:'VB-02',title:'A ponte antes da ponte',speaker:'Manuel Reis',recorded:'2023-10-06',topic:'Lugares',transcript:'Para chegar à escola atravessávamos de barco. Quando o rio subia, esperávamos na margem com os cadernos debaixo do casaco. A ponte trouxe outro caminho. O barco ficou preso ao cais até ao verão seguinte.'},
  {id:'VB-03',title:'Domingos na associação',speaker:'Lídia Alves',recorded:'2024-06-22',topic:'Encontros',transcript:'Cada pessoa trazia uma cadeira. Umas eram de cozinha, outras dobravam, e havia uma que rangia sempre. A reunião começava quando se acabava o café. Foi ali que aprendi que uma sala podia pertencer a toda a gente.'},
  {id:'VB-04',title:'O pregão do mercado',speaker:'António Luz',recorded:'2023-05-09',topic:'Trabalho',transcript:'Sabíamos quem estava a chegar sem olhar. Cada vendedor tinha a sua maneira de anunciar a fruta. Quando comecei a trabalhar no mercado, a minha voz desaparecia ao fim da manhã. A vizinha ensinou-me a respirar antes de chamar.'},
  {id:'VB-05',title:'O jardim que plantámos',speaker:'Celeste Moura',recorded:'2025-02-14',topic:'Lugares',transcript:'Primeiro apareceram três vasos junto ao muro. Depois uma mangueira, sementes e uma chave que toda a gente sabia onde encontrar. Ninguém desenhou o jardim inteiro. Fomos percebendo os caminhos à medida que as plantas cresciam.'},
  {id:'VB-06',title:'A rádio da escada',speaker:'Rui Tavares',recorded:'2025-04-03',topic:'Encontros',transcript:'Ao sábado, o vizinho deixava a porta entreaberta durante o relato. No intervalo discutia-se o jogo de patamar para patamar. Eu não gostava de futebol, mas gostava de saber que o prédio estava acordado.'}
];
export const STORAGE_KEY='vozes-do-bairro:collection:v1';
export const normalize=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-PT').trim();
export function filterRecords({query='',topic='Todos',collection=false,saved=[]}={}) {
  const terms=normalize(query).split(/\s+/).filter(Boolean);
  return records.filter(record => (!collection || saved.includes(record.id)) && (topic==='Todos'||record.topic===topic) && terms.every(term=>normalize(Object.values(record).join(' ')).includes(term)));
}
export function parseSaved(raw) {
  if(raw===null) return [];
  const value=JSON.parse(raw);
  if(!Array.isArray(value)) throw new Error('Formato de coleção inválido');
  return [...new Set(value.filter(id=>records.some(record=>record.id===id)))];
}
export function toggleSaved(saved,id) {
  if(!records.some(record=>record.id===id)) return saved;
  return saved.includes(id)?saved.filter(item=>item!==id):[...saved,id];
}
export function formatDate(value,short=false) {
  return new Intl.DateTimeFormat('pt-PT',{day:'numeric',month:short?'short':'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));
}
