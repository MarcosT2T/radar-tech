"""Verificação técnica gratuita de links do catálogo. Não valida promoções."""
import json
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parents[1]
catalog = json.loads((ROOT / "data/opportunities.json").read_text(encoding="utf-8"))
results = []
for item in catalog["oportunidades"]:
    url = item["url"]
    status = "indisponível"
    try:
        request = Request(url, headers={"User-Agent": "RadarTechLinkCheck/1.0", "Accept": "text/html"})
        with urlopen(request, timeout=12) as response:
            status = str(response.status)
    except HTTPError as error:
        status = str(error.code) + " (pode haver proteção contra robôs)"
    except (URLError, TimeoutError, OSError) as error:
        status = "falha de rede ou bloqueio"
    results.append((item["nome"], url, status))

lines = ["# Checagem diária de links oficiais", "",
         "Esta checagem indica apenas se a página respondeu. Não confirma vouchers, prazos, preços ou elegibilidade.", "",
         "| Programa | Resposta | Link |", "|---|---|---|"]
for name, url, status in results:
    lines.append(f"| {name.replace('|', '/')} | {status} | [Abrir]({url}) |")
report = "\n".join(lines) + "\n"
print(report)
summary = __import__("os").environ.get("GITHUB_STEP_SUMMARY")
if summary:
    with open(summary, "a", encoding="utf-8") as file:
        file.write(report)
