import zipfile
import platform

class Archive:
    def __init__(self):
        pass

    def extract_archive(self, archive_file, dest):
        os_name = platform.system().lower()
        if os_name in ['windows', 'linux']:
            return self.__unzip(archive_file, dest)
        else:
            raise Exception("unsupported operating system")

    def __unzip(self, zip_file, dest):
        try:
            with zipfile.ZipFile(zip_file, 'r') as zip_ref:
                zip_ref.extractall(dest)
        except zipfile.BadZipFile as e:
            return e
        return None