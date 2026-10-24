# Radar Tech

Catálogo independente de certificações profissionais e oportunidades de exame em tecnologia. Reúne links oficiais, modalidades, áreas de atuação e condições conhecidas para facilitar a comparação.

**Site:** https://marcost2t.github.io/radar-tech/

## Organização

| Arquivo | Função |
| --- | --- |
| `index.html` | Estrutura da interface |
| `assets/styles.css` | Estilos responsivos |
| `assets/app.js` | Pesquisa, filtros, tabela e cartões |
| `data/opportunities.json` | Catálogo público |
| `scripts/validate.py` | Verificação de integridade dos registros |
| `.github/workflows/quality.yml` | Validação do catálogo e sintaxe JavaScript em commits |
| `docs/OPERACAO.md` | Procedimento de atualização |

## Execução local

```bash
python -m http.server 8000
```

Abra http://localhost:8000. O projeto não requer instalação de dependências de terceiros.

## Manutenção

As oportunidades são registradas em `data/opportunities.json`. O processo de pesquisa e revisão é externo ao site: novas informações são conferidas em páginas oficiais e só então publicadas por commit. Uma tarefa diária de acompanhamento pode auxiliar na pesquisa e edição do repositório, desde que a conexão de escrita esteja disponível. **Não existe agente executando dentro do GitHub, nem atualização autônoma garantida.**

O GitHub Pages publica os arquivos da branch `main`. O workflow de qualidade verifica o JSON e a sintaxe do JavaScript a cada alteração; ele não pesquisa oportunidades.

Registros não verificados ficam como `A confirmar`. Datas desconhecidas são `null`; cursos, avaliações práticas e exames oficiais são modalidades diferentes. O catálogo inicial é uma referência, não uma lista de promoções confirmadas.

## Privacidade e custos

Site estático, sem cadastro, cookies próprios, servidor de aplicação ou serviços pagos integrados. O uso da infraestrutura do GitHub segue as regras do plano da conta.

O projeto não é afiliado aos fabricantes.
