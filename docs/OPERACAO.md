# Operação e manutenção

## Publicação
Ative GitHub Pages em **Settings → Pages → Deploy from a branch**, com branch `main` e pasta `/(root)`.

## Custos
O site é estático. Os scripts utilizam apenas a biblioteca padrão do Python; não é necessária chave de API. O workflow agendado usa GitHub Actions no repositório público, sujeito às políticas e limites gratuitos do GitHub. Não há garantia contratual de custo zero se as regras da plataforma mudarem; acompanhe as configurações de cobrança.

## Duas rotinas complementares
1. **Checagem de links:** o workflow `daily-check.yml` roda diariamente por volta das 8h15 de Brasília. Ele verifica respostas HTTP e produz um resumo em **Actions**. Um link ativo não comprova que um desconto ou voucher está vigente.
2. **Revisão editorial:** novas oportunidades e mudanças em ofertas precisam de conferência da fonte oficial, condições brasileiras e datas. Essa revisão pode ser auxiliada por uma tarefa recorrente no ChatGPT, com escrita no GitHub quando a integração estiver disponível. Não há serviço de IA pago executado pelo repositório.

## Como editar
Edite `data/opportunities.json`, mantendo a estrutura. O status `Vigente` exige uma data real em `verificado_em` e evidência oficial; use `A confirmar` se não foi possível verificar. Datas desconhecidas são `null`. Separe o encerramento da inscrição da validade do voucher.

Antes de publicar, execute:

```bash
python scripts/validate.py
node --check assets/app.js
```

O workflow `quality.yml` repete essas verificações em alterações no GitHub.

## Critérios
- Preferir páginas oficiais e termos de campanha específicos.
- Não confundir cursos, credenciais práticas e exames de certificação.
- Não inferir elegibilidade brasileira a partir de campanhas de outros países.
- Não afirmar gratuidade ou prazos sem evidência.
- Registrar mudanças significativas em commits descritivos.
