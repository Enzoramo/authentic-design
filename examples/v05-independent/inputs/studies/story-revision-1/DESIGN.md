# Vereda

## Escopo e evidência

Requisitos fornecidos: narrativa exata em português, sete passagens, escolhas determinísticas, voltar uma passagem, percurso percorrido, retomada no recarregamento, tamanho do texto persistente e reinício com confirmação nos finais. HTML/CSS/JS locais, sem build, conta, integração ou envio de dados. Nenhuma pesquisa com leitores foi fornecida; as decisões de composição são hipóteses de design.

Hipótese de uso: uma pessoa lê sozinha no computador ou telefone; precisa distinguir a passagem atual das escolhas e rever uma decisão sem perder contexto. O custo relevante é perder o percurso por engano. A confirmação só aparece ao reiniciar, não a cada escolha.

## Modelo da tarefa

Entrar ou retomar → ler passagem atual → escolher → nova passagem. Voltar remove a última passagem do percurso ativo. Percurso lista somente as passagens já percorridas, sem revelar caminhos futuros, e permite consultar o texto sem alterar o ponto guardado; “Retomar leitura” fecha a consulta. Ajustes de texto não mudam o percurso. Finais oferecem voltar ou reiniciar; cancelar o reinício mantém a leitura intacta.

## Estudo antes da implementação

`direction-study.html` contém três espécimes comparáveis com texto real, duas escolhas, estado de salvamento e acesso ao percurso:

- A, Margem de leitura: a passagem ocupa a coluna ampla; uma linha lateral conserva o rastro percorrido. Charter na prosa, Optima no nome; cinza muito claro com tinta ameixa. A relação vem do mapa e da leitura, sem reproduzir um mapa geográfico ou revelar finais.
- B, Fita contínua: uma passagem é uma unidade visível de uma sequência, com número real de posição; prosa sans, campo escuro e escolhas lado a lado no computador. Derivada das fitas e do ato de continuar uma escuta, sem simular controles de áudio.
- C, Registro vivo: alinhamento monoespaçado e linhas de entrada fazem a narrativa parecer um registro que ganha escolhas. Derivada do catálogo e das histórias conservadas. Nome sans independente do texto.

Fontes instaladas inspecionadas: Optima, Avenir, Avenir Next Condensed, Charter, Iowan Old Style, Georgia, Courier e Helvetica Neue, entre outras. Nenhum arquivo proprietário foi copiado. O produto usará fontes locais por nome com fallbacks explícitos; o ambiente final pode mudar o desenho das letras.

A comparação adicional mantém geometria e paleta constantes para avaliar Optima/Charter e Iowan Old Style, com o nome fornecido “Vereda” e alternativa em capitais. **Seleção pendente das capturas neutras. Nenhuma direção ainda foi aceita.**
