# Radar Tech

Catálogo público de certificações profissionais e oportunidades de exame em tecnologia. O site separa certificações oficiais, programas de formação e campanhas promocionais, com links de origem, condições conhecidas e histórico de conferência.

**Site:** https://marcost2t.github.io/radar-tech/

## Estrutura

- `index.html`: estrutura da página.
- `assets/styles.css`: identidade visual responsiva.
- `assets/app.js`: tabela, cartões, pesquisa, filtros e ordenação.
- `data/opportunities.json`: registros publicados.
- `scripts/check_sources.py`: verificação técnica de URLs oficiais, sem uso de API paga.
- `tests/test_catalog.py`: testes de integridade dos dados.
- `.github/workflows/quality.yml`: validação em alterações.
- `.github/workflows/daily-check.yml`: execução diária gratuita, com relatório no GitHub Actions.
- `docs/OPERACAO.md`: critérios de publicação e manutenção.

## Rodar localmente

```bash
python -m http.server 8000
```

Abra http://localhost:8000. Não é necessário instalar pacotes Python de terceiros.

## Atualizações sem custo

A checagem diária é feita com GitHub Actions em repositório público, usando a infraestrutura disponibilizada pelo GitHub conforme os limites e regras do plano. Ela **não usa OpenAI API, chaves de pagamento ou serviços externos pagos**.

A rotina verifica se os endereços oficiais cadastrados respondem e registra o resultado no resumo da execução. **Um HTTP 200 não comprova promoção, elegibilidade ou validade de voucher.** Portanto, o catálogo só é alterado após conferência efetiva das condições em páginas oficiais. O monitoramento diário em ChatGPT pode auxiliar nessa revisão e realizar alterações no JSON via integração GitHub quando houver evidências suficientes; isso depende de disponibilidade e permissões da integração.

## Política de dados

Cada registro informa `categoria`, `tipo`, `status`, `url`, `origem`, `brasil`, `inscricao_ate`, `voucher_ate` e `verificado_em`. Datas desconhecidas usam `null`; registros não verificados permanecem como `A confirmar`. Não anunciar vouchers como disponíveis sem fonte e condições atuais verificadas.

O site não solicita cadastro nem armazena informações pessoais. É um levantamento independente, sem vínculo com os fabricantes.
