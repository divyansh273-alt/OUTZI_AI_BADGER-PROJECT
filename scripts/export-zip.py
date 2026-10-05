#!/usr/bin/env python3
import os
import zipfile

def create_export_zip():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(base_dir)

    zip_filename = "outzi-ai.zip"
    public_dir = os.path.join(base_dir, "public")
    os.makedirs(public_dir, exist_ok=True)
    public_zip = os.path.join(public_dir, zip_filename)

    include_root_files = [
        "package.json", "tsconfig.json", "vite.config.ts", "metadata.json",
        "index.html", "README.md", ".env.example", ".gitignore", "server.ts"
    ]

    print("Bundling OUTZI.AI codebase into clean ZIP archive...")

    with zipfile.ZipFile(zip_filename, "w", zipfile.ZIP_DEFLATED) as z:
        for f in include_root_files:
            if os.path.exists(f):
                z.write(f, os.path.join("outzi-ai", f))
                print(f"  + {f}")

        for root, dirs, files in os.walk("src"):
            for file in files:
                full_path = os.path.join(root, file)
                arcname = os.path.join("outzi-ai", full_path)
                z.write(full_path, arcname)
                print(f"  + {full_path}")

    # Copy to public folder for web server download
    import shutil
    shutil.copy2(zip_filename, public_zip)

    size_kb = os.path.getsize(zip_filename) / 1024.0
    print(f"\n✅ Created {zip_filename} ({size_kb:.1f} KB)")
    print(f"✅ Ready at: {zip_filename} and public/{zip_filename}")

if __name__ == "__main__":
    create_export_zip()
