import hashlib
import os
import shutil

class FileSync:
    def __init__(self, source_dir, target_dir, ignored_file_names):
        self.source_dir = source_dir
        self.target_dir = target_dir
        self.ignored_file_names = ignored_file_names

    def list_files(self, dir_path):
        files = []
        for root, dirs, filenames in os.walk(dir_path):
            for filename in filenames:
                if not any(ignored in filename for ignored in self.ignored_file_names):
                    files.append(os.path.join(root, filename))
        return files

    def get_file_hash(self, file_path):
        hash_md5 = hashlib.md5()
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()

    def sync_files(self):
        try:
            source_files = self.list_files(self.source_dir)
            target_files = self.list_files(self.target_dir)
        except Exception as e:
            raise RuntimeError(f"Error listing directory: {e}")

        source_hashes = {}
        for file_path in source_files:
            rel_path = os.path.relpath(file_path, self.source_dir)
            try:
                file_hash = self.get_file_hash(file_path)
            except Exception as e:
                raise RuntimeError(f"Error getting hash for {file_path}: {e}")
            source_hashes[rel_path] = file_hash

        target_hashes = {}
        for file_path in target_files:
            rel_path = os.path.relpath(file_path, self.target_dir)
            try:
                file_hash = self.get_file_hash(file_path)
            except Exception as e:
                raise RuntimeError(f"Error getting hash for {file_path}: {e}")
            target_hashes[rel_path] = file_hash

        for rel_path, source_hash in source_hashes.items():
            target_hash = target_hashes.get(rel_path)
            if target_hash != source_hash:
                source_file_path = os.path.join(self.source_dir, rel_path)
                target_file_path = os.path.join(self.target_dir, rel_path)
                try:
                    shutil.copy2(source_file_path, target_file_path)
                except Exception as e:
                    raise RuntimeError(f"Error copying file {source_file_path} to {target_file_path}: {e}")

        for rel_path in target_hashes:
            if rel_path not in source_hashes:
                target_file_path = os.path.join(self.target_dir, rel_path)
                try:
                    os.remove(target_file_path)
                except Exception as e:
                    raise RuntimeError(f"Error deleting file {target_file_path}: {e}")
