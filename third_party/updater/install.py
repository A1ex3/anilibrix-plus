import os
import urllib.request
import tarfile

def log(message):
    print(f"[INFO] {message}")

def make_dir(dir_path):
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        log(f"Directory created: {dir_path}")
    else:
        log(f"Directory already exists: {dir_path}")

def write_file(path, data):
    with open(path, 'wb') as out_file:
        out_file.write(data)
    log(f"File written: {path}")

def remove_file(path):
    if os.path.exists(path):
        os.remove(path)
        log(f"File removed: {path}")
    else:
        log(f"File not found, skipping removal: {path}")

def extract_tar_gz(path_to_file, extract_path):
    log(f"Extracting file: {path_to_file} to {extract_path}")
    with tarfile.open(path_to_file, 'r:gz') as tar:
        tar.extractall(path=extract_path)
    log(f"Extraction complete: {path_to_file}")

def install_updater(target_dir, version, os):
    log(f"Starting updater installation: version={version}, os={os}")
    URL = 'https://github.com/A1ex3/anilibrix-plus-updater/releases/download'
    WINDOWS_FILES_LIST = ['windows-arm64.tar.gz', 'windows-x64.tar.gz']
    LINUX_FILES_LIST = ['linux-arm64.tar.gz', 'linux-x64.tar.gz']

    make_dir(target_dir)

    if os == 'windows':
        for filename in WINDOWS_FILES_LIST:
            log(f"Processing file: {filename}")
            path_to_archive = f'{target_dir}/{filename}'

            with urllib.request.urlopen(f'{URL}/{version}/{filename}') as response:
                write_file(path_to_archive, response.read())
            extract_tar_gz(path_to_archive, target_dir)
            remove_file(path_to_archive)
    elif os == 'linux':
        for filename in LINUX_FILES_LIST:
            log(f"Processing file: {filename}")
            path_to_archive = f'{target_dir}/{filename}'

            with urllib.request.urlopen(f'{URL}/{version}/{filename}') as response:
                write_file(path_to_archive, response.read())
            extract_tar_gz(path_to_archive, target_dir)
            remove_file(path_to_archive)
    else:
        log(f"This operating system is not supported! OS: {os}")
        return

    log(f"Updater installation completed for version {version} on {os}.")
