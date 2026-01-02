import csv
import os
from typing import List, Dict, Any


def parse_csv_file(file_path: str) -> Dict[str, Any]:
    """Parse a CSV file and return headers and rows as dictionaries"""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"CSV file not found: {file_path}")

    with open(file_path, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        headers = csv_reader.fieldnames or []
        rows = [row for row in csv_reader]

    return {
        "headers": headers,
        "rows": rows,
        "total_rows": len(rows)
    }
