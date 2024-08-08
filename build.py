import os
import platform
import json
import re
import shutil
import subprocess

def make_dir(dir_path):
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        print(f"Directory created: {dir_path}")
    else:
        print(f"Directory already exists: {dir_path}")

def remove_directory(path):
    if os.path.exists(path) and os.path.isdir(path):
        shutil.rmtree(path)
        print(f"Directory '{path}' has been successfully removed.")
    else:
        print(f"Directory '{path}' does not exist or is not a directory.")

def get_line_from_file(file_path, line_number = 1):
    try:
        with open(file_path, 'r') as file:
            lines = file.readlines()
            if 1 <= line_number <= len(lines):
                return lines[line_number - 1].strip()
            else:
                return None
    except FileNotFoundError:
        print(f"File not found: {file_path}")
        return None

def move_by_patterns(source_dir, destination_dir, patterns):
    if not os.path.exists(source_dir):
        raise FileNotFoundError(f"The source directory does not exist: {source_dir}")

    if not os.path.exists(destination_dir):
        os.makedirs(destination_dir)

    for entry in os.listdir(source_dir):
        entry_path = os.path.join(source_dir, entry)
        if any(re.fullmatch(pattern, entry) for pattern in patterns):
            dest_path = os.path.join(destination_dir, entry)
            try:
                shutil.move(entry_path, dest_path)
                print(f"Moved: {entry_path} -> {dest_path}")
            except Exception as e:
                print(f"Moving error {entry_path}: {e}")

def run_shell_command(command, cwd=None):
    try:
        if platform.system() == "Windows":
            full_command = ["powershell", "-Command", command]
        else:
            full_command = ["bash", "-c", command]

        result = subprocess.run(
            full_command, 
            cwd=cwd,
            text=True,
            capture_output=True
        )

        return result.stdout, result.stderr, result.returncode

    except Exception as e:
        return "", str(e), 1

class ThirdParty:
    def updater(self, path, os, arch):
        WINDOWS_DIRS_LIST = ['windows-arm64', 'windows-x64']
        LINUX_DIRS_LIST = ['linux-arm64', 'linux-x64']
        FILE_NAME = 'updater'
        CHECKSUM_FILE = 'checksum.txt'
        response = {}

        if os == 'windows':
            if arch == 'arm64':
                path_ = f'{path}/{WINDOWS_DIRS_LIST[0]}'
                response = {
                    'path': f'{path_}/{FILE_NAME}.exe',
                    'checksum': get_line_from_file(f'{path_}/{CHECKSUM_FILE}')
                }
            elif arch == 'x64':
                path_ = f'{path}/{WINDOWS_DIRS_LIST[1]}'
                response = {
                    'path': f'{path_}/{FILE_NAME}.exe',
                    'checksum': get_line_from_file(f'{path_}/{CHECKSUM_FILE}')
                }
        elif os == 'linux':
            if arch == 'arm64':
                path_ = f'{path}/{LINUX_DIRS_LIST[0]}'
                response = {
                    'path': f'{path_}/{FILE_NAME}',
                    'checksum': get_line_from_file(f'{path_}/{CHECKSUM_FILE}')
                }
            elif arch == 'x64':
                path_ = f'{path}/{LINUX_DIRS_LIST[1]}'
                response = {
                    'path': f'{path_}/{FILE_NAME}',
                    'checksum': get_line_from_file(f'{path_}/{CHECKSUM_FILE}')
                }
        else:
            response = None
        return response

class PackageJson:
    def __init__(self, package_json_path) -> None:
        self.__package_json_path = package_json_path
        self.__data = self.__read_json_file()

    def __read_json_file(self):
        with open(self.__package_json_path, 'r') as file:
            data = json.load(file)

        return data

    def write_json_file(self):
        with open(self.__package_json_path, 'w', encoding='utf-8') as file:
            json.dump(self.__data, file, indent=4)

    def set_updater_checksum_sha512(self, value):
        self.__data['updater_checksum_sha512'] = value

    def set_path_to_updater_file(self, value):
        self.__data['build']['extraFiles'][0]['from'] = value

    def clean(self, path_to_updater_placeholder):
        self.set_updater_checksum_sha512('')
        self.set_path_to_updater_file(path_to_updater_placeholder)

def main():
    CWD = os.getcwd()
    RELEASE_DIR = 'release'
    PACKAGE_JSON_PATH = 'package.json'
    UPDATER_PATH_PLACEHOLDER = 'path_to_updater'
    THIRD_PARTY_DIR = 'third_party'
    THIRD_PARTY_UPDATER_PATH = f'{THIRD_PARTY_DIR}/updater'
    OUT_DIR = 'out'
    CURRENT_OS = platform.system().lower()
    ARCH_X64 = 'x64'
    ARCH_ARM64 = 'arm64'

    make_dir(OUT_DIR)

    try:
        package_json = PackageJson(PACKAGE_JSON_PATH)

        if CURRENT_OS == 'windows':
            # Build for Windows-x64
            print("Build for Windows-x64...")
            third_party = ThirdParty()
            third_party_updater = third_party.updater(THIRD_PARTY_UPDATER_PATH, CURRENT_OS, ARCH_X64)

            package_json.set_path_to_updater_file(third_party_updater['path'])
            package_json.set_updater_checksum_sha512(third_party_updater['checksum'])
            package_json.write_json_file()
            rsc = run_shell_command('yarn release:windows', CWD)
            if rsc[2] > 0:
                print(rsc)
            move_by_patterns('release', OUT_DIR, [r'.*-win-.*-setup\.exe$', r'win-unpacked$'])
            remove_directory(RELEASE_DIR)
            print("Windows-x64 application build is complete")

            # Build for Windows-arm64
            print("Build for Windows-arm64...")
            third_party = ThirdParty()
            third_party_updater = third_party.updater(THIRD_PARTY_UPDATER_PATH, CURRENT_OS, ARCH_ARM64)

            package_json.set_path_to_updater_file(third_party_updater['path'])
            package_json.set_updater_checksum_sha512(third_party_updater['checksum'])
            package_json.write_json_file()
            rsc = run_shell_command('yarn release:windows', CWD)
            if rsc[2] > 0:
                print(rsc)
            move_by_patterns('release', OUT_DIR, [r'win-arm64-unpacked$'])
            remove_directory(RELEASE_DIR)
            print("Windows-arm64 application build is complete")

            # Build for Windows-other
            print("Build for Windows-other...")
            package_json.set_path_to_updater_file(UPDATER_PATH_PLACEHOLDER)
            package_json.set_updater_checksum_sha512('')
            package_json.write_json_file()
            rsc = run_shell_command('yarn release:windows', CWD)
            if rsc[2] > 0:
                print(rsc)
            move_by_patterns('release', OUT_DIR, [r'.*-win-[0-9]+\.[0-9]+\.[0-9]+\.exe$', r'.*-win-ia32-.*\.exe$', r'.*-win-x64-.*\.exe$', r'.*-win-arm64-.*\.exe$', r'win-ia32-unpacked$'])
            remove_directory(RELEASE_DIR)
            print("Windows-other application build is complete")

        elif CURRENT_OS == 'linux':
            # Build for Linux-x64
            print("Build for Linux-x64...")
            third_party = ThirdParty()
            third_party_updater = third_party.updater(THIRD_PARTY_UPDATER_PATH, CURRENT_OS, ARCH_X64)

            package_json.set_path_to_updater_file(third_party_updater['path'])
            package_json.set_updater_checksum_sha512(third_party_updater['checksum'])
            package_json.write_json_file()
            rsc = run_shell_command('yarn release:linux', CWD)
            if rsc[2] > 0:
                print(rsc)
            move_by_patterns('release', OUT_DIR, [r'.*-linux-amd64-.*\.snap', r'.*-linux-x86_64-.*\.AppImage', r'.*-linux-x86_64-.*\.rpm', r'linux-unpacked'])
            remove_directory(RELEASE_DIR)
            print("Linux-x64 application build is complete")

            # Build for Linux-arm64
            print("Build for Linux-arm64...")
            third_party = ThirdParty()
            third_party_updater = third_party.updater(THIRD_PARTY_UPDATER_PATH, CURRENT_OS, ARCH_ARM64)

            package_json.set_path_to_updater_file(third_party_updater['path'])
            package_json.set_updater_checksum_sha512(third_party_updater['checksum'])
            package_json.write_json_file()
            rsc = run_shell_command('yarn release:linux', CWD)
            if rsc[2] > 0:
                print(rsc)
            move_by_patterns('release', OUT_DIR, [r'.*-linux-arm64-.*\.AppImage', r'.*-linux-aarch64-.*\.rpm', r'linux-arm64-unpacked'])
            remove_directory(RELEASE_DIR)
            print("Linux-arm64 application build is complete")

            # Build for Linux-other
            print("Build for Linux-other...")
            package_json.set_path_to_updater_file(UPDATER_PATH_PLACEHOLDER)
            package_json.set_updater_checksum_sha512('')
            package_json.write_json_file()
            rsc = run_shell_command('yarn release:linux', CWD)
            if rsc[2] > 0:
                print(rsc)
            move_by_patterns('release', OUT_DIR, [r'.*-linux-i386-.*\.AppImage', r'.*-linux-i686-.*\.rpm', r'linux-ia32-unpacked'])
            remove_directory(RELEASE_DIR)
            print("Linux-other application build is complete")

        elif CURRENT_OS == 'darwin':
            # Build for macOS-x64
            print("Build for macOS-x64...")
            rsc = run_shell_command('yarn release:mac', CWD)
            if rsc[2] > 0:
                print(rsc)
            move_by_patterns('release', OUT_DIR, [r'.*\.dmg'])
            remove_directory(RELEASE_DIR)
            print("macOS-x64 application build is complete")

        else:
            print("This operating system is not supported!")
    finally:
        package_json.clean(UPDATER_PATH_PLACEHOLDER)

if __name__ == '__main__':
    main()