import pandas as pd
import json

file_path = "technical coding 2Library Management 1.xlsx"
output_file = "excel_content.txt"

with open(output_file, "w", encoding="utf-8") as f:
    try:
        xl = pd.ExcelFile(file_path)
        f.write(f"Sheets: {xl.sheet_names}\n")
        for sheet in xl.sheet_names:
            f.write(f"\n{'='*20}\nSheet: {sheet}\n{'='*20}\n")
            df = pd.read_excel(file_path, sheet_name=sheet)
            # Remove completely empty rows and columns
            df = df.dropna(how='all').dropna(axis=1, how='all')
            f.write(df.to_string())
            f.write(f"\n\nShape: {df.shape}\n")
    except Exception as e:
        f.write(f"Error: {e}\n")

print(f"Content written to {output_file}")
