import os
import shutil

def delete_after(app_dir: str, objects: list[str]) -> None:
    for obj in objects:
        full_path = app_dir + obj
        try:
            if os.path.isdir(full_path):
                shutil.rmtree(full_path)
            else:
                os.remove(full_path)
        except Exception as e:
            return
    return None