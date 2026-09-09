import json
from pathlib import Path
from typing import List, Optional, Dict, Any

DATA_PATH = Path(__file__).parent / "data" / "leaves.json"

class LeafDatabase:
    def __init__(self, data_file: Path = DATA_PATH):
        self.data_file = data_file
        self.leaves: List[Dict[str, Any]] = []
        self._by_class: Dict[str, Dict[str, Any]] = {}
        self._by_id: Dict[str, Dict[str, Any]] = {}
        self.load()

    def _slugify(self, text: str) -> str:
        return text.lower().replace(" ", "-").replace("(", "").replace(")", "").replace("/", "-").strip("-")

    def load(self):
        with open(self.data_file, "r", encoding="utf-8") as f:
            raw_leaves = json.load(f)

        self.leaves = []
        self._by_class = {}
        self._by_id = {}

        for item in raw_leaves:
            slug = self._slugify(item["class_name"])
            enriched = {
                "id": slug,
                **item
            }
            self.leaves.append(enriched)
            self._by_class[item["class_name"].lower()] = enriched
            self._by_class[item["class_name"].lower().replace("_", " ")] = enriched
            self._by_id[slug] = enriched

    def get_all(self, search: Optional[str] = None, category: Optional[str] = None) -> List[Dict[str, Any]]:
        results = self.leaves
        if category and category.lower() != "all":
            results = [leaf for leaf in results if leaf.get("category", "").lower() == category.lower()]

        if search:
            query = search.strip().lower()
            filtered = []
            for leaf in results:
                names = [
                    leaf.get("name", "").lower(),
                    leaf.get("class_name", "").lower(),
                    leaf.get("botanical_name", "").lower(),
                    leaf.get("family", "").lower(),
                    *leaf.get("regional_names", {}).values()
                ]
                if any(query in str(n).lower() for n in names if n):
                    filtered.append(leaf)
                elif any(query in b.lower() for b in leaf.get("benefits", [])):
                    filtered.append(leaf)
            results = filtered

        return results

    def get_by_name_or_id(self, identifier: str) -> Optional[Dict[str, Any]]:
        key = identifier.strip().lower()
        if key in self._by_id:
            return self._by_id[key]
        if key in self._by_class:
            return self._by_class[key]
        
        # Fallback slug match
        slug = self._slugify(key)
        if slug in self._by_id:
            return self._by_id[slug]

        for leaf in self.leaves:
            if leaf.get("name", "").lower() == key or leaf.get("botanical_name", "").lower() == key:
                return leaf

        return None

    def get_categories(self) -> List[str]:
        cats = sorted(list({leaf.get("category") for leaf in self.leaves if leaf.get("category")}))
        return ["All", *cats]


db = LeafDatabase()
