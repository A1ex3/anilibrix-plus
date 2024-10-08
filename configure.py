import platform
from build.scripts.python.libs import logger
from third_party.updater.install import install_updater

def main():
    THIRD_PARTY_DIR = 'third_party'
    CURRENT_OS = platform.system().lower()

    logger.info("Installation of the \"updater\" program started...")
    TARGET_DIR_UPDATER = f'{THIRD_PARTY_DIR}/updater'
    install_updater(TARGET_DIR_UPDATER, 'v0.0.1', CURRENT_OS)
    logger.info("Installation of the \"updater\" program is complete.")

if __name__ == '__main__':
    main()