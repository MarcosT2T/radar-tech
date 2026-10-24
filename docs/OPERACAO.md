# Operação

## Publicação

Em **Settings → Pages**, selecione **Deploy from a branch**, branch `main` e pasta `/(root)`. A atualização do site acompanha os commits publicados nessa branch.

## Fluxo de manutenção

1. Pesquisar programas e campanhas em páginas oficiais, priorizando elegibilidade no Brasil.
2. Confirmar natureza da credencial, custo, requisitos e datas. Um link acessível não comprova que uma promoção continua válida.
3. Editar `data/opportunities.json` com as informações verificadas.
4. Executar `python scripts/validate.py` e `node --check assets/app.js`.
5. Publicar um commit descritivo e conferir o resultado no site.

Uma tarefa recorrente de pesquisa pode auxiliar nas etapas 1–3 e, quando houver integração GitHub disponível, enviar as alterações. A execução diária e o acesso de escrita não são garantidos pelo repositório.

## Campos importantes

- `categoria`: área técnica.
- `tipo`: exame oficial, credencial prática ou programa educacional.
- `status`: `Vigente`, `A confirmar` ou `Encerrada`.
- `inscricao_ate`: encerramento das inscrições.
- `voucher_ate`: validade do benefício.
- `verificado_em`: data da conferência efetiva da oferta.
- `url` e `origem`: referência oficial.

Não inventar datas nem condições de elegibilidade. Registros `Vigente` exigem data de verificação. A ausência de prazo não significa disponibilidade permanente.

## Verificação técnica

O workflow `quality.yml` é acionado em push e pull request. Ele confere a estrutura do catálogo e a sintaxe JavaScript. Não realiza pesquisa, scraping nem monitoramento de links.

## Custos e privacidade

Não há chave de API, banco de dados, serviço pago ou processo agendado no GitHub. A publicação estática e os workflows de qualidade seguem as condições de uso do GitHub. O site não coleta dados pessoais.

## Critérios editoriais

- Usar fontes oficiais e preferir páginas específicas de campanhas.
- Diferenciar exame de certificação, credencial prática e certificado de curso.
- Verificar se benefícios são aplicáveis a residentes no Brasil.
- Registrar somente condições efetivamente comprovadas.
- Preservar histórico e contexto das alterações.
