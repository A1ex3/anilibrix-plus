import sys
from view.main_window import MainWindow
from PyQt6.QtWidgets import QApplication

def main():
    APP_NAME: str = "updater"
    args = sys.argv[1:]
    arg_dict = {}
    
    for arg in args:
        if '=' in arg:
            key, value = arg.split('=', 1)
            key = key.strip().strip('-')
            arg_dict[key] = value

    launch_parameters: dict[str, str] = {
        'app_full_path_dir': arg_dict.get('APP_FULL_PATH_DIR', None),
        'close_apps_before_pids_list': arg_dict.get('CLOSE_APPS_BEFORE_PIDS_LIST', None),
        'archive_file_full_path': arg_dict.get('ARCHIVE_FILE_FULL_PATH', None),
        'update_dir': arg_dict.get('UPDATE_DIR', None),
        'files_ignore_list': arg_dict.get('FILES_IGNORE_LIST', None),
        'files_delete_after_list': arg_dict.get('FILES_DELETE_AFTER_LIST', None),
    }

    app = QApplication(sys.argv)
    window = MainWindow(APP_NAME, launch_parameters)
    window.show()
    app.exec()

if __name__ == '__main__':
    main()
