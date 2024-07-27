from PyQt6.QtWidgets import QMainWindow, QVBoxLayout, QPushButton, QProgressBar, QLabel, QWidget
from PyQt6.QtCore import QThread, pyqtSignal, Qt, QObject
from archive.unzip import Archive
from sync.other import delete_after
from sync.sync import FileSync
from process.kill import Process

class UpdateThread(QThread):
    progress = pyqtSignal(int)
    status = pyqtSignal(str)
    error = pyqtSignal(str)

    def __init__(self, tasks, workers):
        super().__init__()
        self.tasks = tasks
        self.workers = workers

    def run(self):
        total_tasks = len(self.tasks)
        for i, (func, description) in enumerate(self.tasks.items()):
            try:
                self.status.emit(f"{description}...")
                func()
                progress_value = int((i + 1) / total_tasks * 100)
                self.progress.emit(progress_value)
                self.status.emit(f"{description} завершено ({progress_value}%)")
            except Exception as e:
                self.error.emit(f"Ошибка: {e}")
                break

class MainWindow(QMainWindow):
    def __init__(self, app_name: str, launch_parameters: dict[str, str]):
        super().__init__()

        self.__workers = Workers(
            launch_parameters['app_full_path_dir'],
            launch_parameters['close_apps_before_pids_list'],
            launch_parameters['archive_file_full_path'],
            launch_parameters['update_dir'],
            launch_parameters['files_ignore_list'],
            launch_parameters['files_delete_after_list'],
        )

        # Подключаем сигналы для ошибок
        self.__workers.signals.error.connect(self.handle_error)

        self.setWindowTitle(app_name)
        self.setGeometry(100, 100, 450, 450)
        self.setFixedSize(450, 450)

        self.progress_bar = QProgressBar()
        self.progress_bar.setMaximum(100)

        self.close_button = QPushButton("Закрыть")
        self.close_button.setVisible(False)
        self.close_button.clicked.connect(self.close_application)

        self.status_label = QLabel("Начинаю обновление...")
        self.status_label.setAlignment(Qt.AlignmentFlag.AlignCenter)

        layout = QVBoxLayout()
        layout.addWidget(self.status_label)
        layout.addWidget(self.progress_bar)
        layout.addWidget(self.close_button)

        container = QWidget()
        container.setLayout(layout)
        self.setCentralWidget(container)

        self.start_update()

    def start_update(self):
        tasks = {
            self.__workers.extract_archive: "Распаковка архива",
            self.__workers.kill_processes: "Закрытие приложения",
            self.__workers.sync_files: "Синхронизация файлов",
            self.__workers.delete_after: "Удаление временных файлов",
        }
        self.update_thread = UpdateThread(tasks, self.__workers)
        self.update_thread.progress.connect(self.progress_bar.setValue)
        self.update_thread.status.connect(self.status_label.setText)
        self.update_thread.error.connect(self.handle_error)
        self.update_thread.start()
        self.update_thread.finished.connect(self.update_finished)

    def handle_error(self, message):
        self.status_label.setText(f"Ошибка: {message}")
        self.update_thread.quit()
        self.update_thread.wait()
        self.close_button.setVisible(True)

    def update_finished(self):
        if not self.status_label.text().startswith("Ошибка"):
            self.status_label.setText("Обновление завершено")
            self.close_button.setVisible(True)

    def close_application(self):
        self.close()

    def closeEvent(self, event):
        if hasattr(self, 'update_thread') and self.update_thread.isRunning():
            self.update_thread.quit()
            self.update_thread.wait()
        event.accept()

class WorkerSignals(QObject):
    error = pyqtSignal(str)

class Workers:
    def __init__(
        self,
        app_full_path_dir,
        close_apps_before_pids_list,
        archive_file_full_path,
        update_dir,
        files_ignore_list,
        files_delete_after_list
    ) -> None:
        self.__app_full_path_dir = app_full_path_dir
        self.__close_apps_before_pids_list = close_apps_before_pids_list
        self.__archive_file_full_path = archive_file_full_path
        self.__update_dir = update_dir
        self.__files_ignore_list = files_ignore_list
        self.__files_delete_after_list = files_delete_after_list

        self.signals = WorkerSignals()

    def __parse_comma_separated_list(self, input_string, convert_to_int=False):
        elements = input_string.split(',')

        if convert_to_int:
            parsed_elements = []
            for elem in elements:
                try:
                    parsed_elements.append(int(elem))
                except ValueError as e:
                    self.signals.error.emit(f"Ошибка преобразования '{elem}': {e}")
            return parsed_elements
        else:
            return elements
    
    def extract_archive(self):
        try:
            archive = Archive()
            archive.extract_archive(self.__archive_file_full_path, self.__app_full_path_dir)
        except Exception as e:
            self.signals.error.emit(f"Не удалось разархивировать файлы: {e}")
            raise e
        
    def kill_processes(self):
        process = Process()

        try:
            for i in self.__parse_comma_separated_list(self.__close_apps_before_pids_list, True):
                process.kill(i)
        except Exception as e:
            self.signals.error.emit(f"Не удалось закрыть приложение: {e}")
            raise e

    def sync_files(self):
        try:
            FileSync(self.__app_full_path_dir+self.__update_dir, self.__app_full_path_dir, self.__parse_comma_separated_list(self.__files_ignore_list)).sync_files()
        except Exception as e:
            self.signals.error.emit(f"Не удалось синхронизировать файлы: {e}")
            raise e

    def delete_after(self):
        try:
            delete_after(self.__app_full_path_dir, self.__parse_comma_separated_list(self.__files_delete_after_list))
        except Exception as e:
            self.signals.error.emit(f"Не удалось удалить временные файлы: {e}")
            raise e
