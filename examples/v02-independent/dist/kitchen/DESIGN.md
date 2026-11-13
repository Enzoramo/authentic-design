# Panela — registo da implementação

## Base e direção

**Factos do pedido:** receita fictícia fornecida, sete ingredientes, quatro passos, base de duas pessoas, opções de duas/quatro/seis pessoas, estimativa total de 30 minutos. Sem investigação com utilizadores ou ativos de marca fornecidos.

**Hipótese de utilização:** cozinhar exige consultas breves, controlos legíveis e um lugar inequívoco para retomar. A hipótese orienta a implementação; não constitui uma conclusão de investigação.

Foram consideradas três estruturas antes da implementação:

- **Folha de receita contínua:** ingredientes e método sempre presentes, com pouco esforço de navegação. A leitura de todo o método torna o passo atual menos evidente.
- **Assistente de ecrã inteiro:** um passo ocupa toda a atenção. O acesso às quantidades durante a preparação fica mais distante.
- **Bancada dividida, escolhida:** ingredientes à esquerda e instrução atual à direita. No telefone, a divisão transforma-se em duas vistas com contagens e acesso direto à preparação. Preserva a consulta cruzada no computador; exige alternar vistas no telefone.

**Tarefa → estrutura → expressão → decisões → compromisso:** reunir e cozinhar sem perder o lugar → lista assinalável e sequência com conclusão explícita → uma bancada de trabalho com um painel escuro reservado à ação atual → quantidades alinhadas, número de passo grande, amarelo para a ação principal e marcas de conclusão acompanhadas de texto → só a instrução atual aparece por extenso, com os quatro títulos sempre visíveis na vista de preparação.

A paleta usa azul escuro como tinta, branco nas quantidades e amarelo nas ações. A fonte de sistema evita dependências. Linhas agrupam ingredientes; o painel de contraste elevado separa a ação atual da lista. A pequena ilustração vetorial de arroz e cogumelos é original desta implementação, decorativa e inline. Não há fotografias, fontes remotas ou ativos em falta. A linguagem é português europeu. A estimativa total permanece a fornecida, sem extrapolar o tempo conforme as pessoas.

## Comportamento implementado

- Quantidades calculadas pela proporção da receita base, incluindo os plurais de unidade e dente.
- Ingredientes assinaláveis; mudar pessoas mantém as marcações e apresenta um lembrete para as confirmar.
- Início explícito da preparação, sem obrigar a assinalar todos os ingredientes.
- Avançar conclui o passo; voltar ou selecionar um passo acessível mantém as conclusões anteriores. Um passo concluído que está aberto mostra «A rever». Passos posteriores ainda inacessíveis não podem ser saltados.
- «Concluir receita» no quarto passo abre um estado final persistente. É possível rever e preparar novamente.
- Recomeçar pede confirmação e limpa ingredientes e passos, preservando o número de pessoas. Cancelar e Escape não reiniciam. O valor do diálogo é reposto em cada abertura para evitar reutilizar uma confirmação antiga.
- Estado validado e guardado em localStorage, com chave delimitada pelo caminho servido. Falha de armazenamento tem mensagem explícita; dados incompatíveis ou ilegíveis têm recuperação segura.
- No telefone, a receita retomada abre a preparação quando já começou. Ingredientes permanecem acessíveis numa vista adjacente. Breakpoints implementados a 1000, 760 e 370 px.
- Controlos nativos, labels, foco visível, anúncios de estado, diálogo nativo e foco deslocado para a nova instrução. Sem login, compra, backend ou integrações simuladas.

## Verificação realizada

- `node --check app.mjs` e `node --check model.mjs`: passaram.
- `node check.mjs`: oito verificações passaram, cobrindo os valores exatos das três quantidades, marcações e alteração de pessoas, conclusão explícita, regressão e revisão de passos, serialização/recuperação, reinício, validação de dados e presença da receita fornecida.
- Inspeção estática: IDs HTML únicos; referências CSS/JS locais e existentes; nenhum URL remoto; idioma pt-PT; chavetas CSS equilibradas; regras responsivas presentes.
- Contrastes calculados dos pares principais: texto/base 11,69:1; texto secundário/base 5,52:1; branco/painel 12,81:1; texto secundário/painel 9,65:1; texto/ação amarela 8,82:1; branco/marca verde 6,53:1.

**Limites:** por instrução do ensaio, não foi aberto navegador nem iniciado servidor. Não houve renderização, medição de viewport real, teste de toque/teclado/leitor de ecrã, recarregamento de página real, nem teste da API de armazenamento ou do diálogo num navegador. A serialização e as transições foram verificadas em Node; a ligação ao DOM foi inspecionada no código. As regras de telefone estão implementadas, mas não foi comprovada visualmente a ausência de cortes a 320 px, nem a composição em desktop. Os contrastes não constituem uma auditoria de acessibilidade. Não houve testes com participantes nem avaliação culinária.

## Entrega

`index.html`, `styles.css`, `app.mjs`, `model.mjs`, `check.mjs` e este registo. Todos os recursos de execução são locais e relativos. O protótipo destina-se a ser servido por HTTP a partir de qualquer subdiretório; não exige compilação ou instalação. `REQUEST.md` permanece intacto. Esta é uma única implementação independente, sem consulta de outros ensaios ou correções posteriores à submissão.
