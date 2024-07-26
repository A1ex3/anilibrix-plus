import os
import signal
import platform
import subprocess

class Process:
    def __init__(self):
        pass

    def kill(self, pid):
        os_name = platform.system().lower()
        try:
            if os_name == "windows":
                subprocess.run(["taskkill", "/F", "/PID", str(pid)], check=True)
            elif os_name == "linux":
                os.kill(pid, signal.SIGTERM)
            else:
                raise NotImplementedError("Unsupported operating system")
        except subprocess.CalledProcessError as e:
            return e
        except ProcessLookupError:
            return ValueError(f"Process with PID {pid} does not exist")
        except Exception as e:
            return e
        return None