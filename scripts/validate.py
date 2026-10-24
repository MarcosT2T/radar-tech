"""Valida a estrutura do catálogo antes da publicação."""
import json
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

FILE = Path(__file__).resolve().parents[1] / "data/opportunities.json"

def validate():
    data = json.loads(FILE.read_text(encoding="utf-8"))
    assert isinstance(data.get("oportunidades"), list), "Lista de oportunidades ausente"
    date.fromisoformat(data["atualizado_em"])
    ids = set()
    required = ("id", "nome", "fabricante", "categoria", "tipo", "status", "descricao", "url", "origem", "brasil", "inscricao_ate", "voucher_ate", "verificado_em")
    for item in data["oportunidades"]:
        for key in required:
            assert key in item, f"{item.get('id', '?')}: campo {key} ausente"
        assert item["id"] not in ids, "ID duplicado"
        ids.add(item["id"])
        assert item["status"] in ("Vigente", "A confirmar", "Encerrada"), "Status inválido"
        parsed = urlparse(item["url"])
        assert parsed.scheme == "https" and parsed.netloc, "URL oficial inválida"
        for field in ("inscricao_ate", "voucher_ate", "verificado_em"):
            if item[field] is not None:
                date.fromisoformat(item[field])
        if item["status"] == "Vigente":
            assert item["verificado_em"], "Oferta vigente sem data de verificação"
    print(f"Catálogo válido: {len(ids)} registros")

if __name__ == "__main__":
    validate()
