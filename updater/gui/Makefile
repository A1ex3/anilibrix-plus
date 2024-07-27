PROJECT-NAME := updater
VENV-PATH := venv
VENV-BIN-PATH-WIN := .\$(VENV-PATH)\Scripts
VENV-BIN-PATH-LINUX := ./$(VENV-PATH)/bin
PYTHON-VENV-WIN := $(VENV-BIN-PATH-WIN)\python
PYTHON-VENV-LINUX := $(VENV-BIN-PATH-LINUX)/python3
PIP-VENV-WIN := $(VENV-BIN-PATH-WIN)\pip3
PIP-VENV-LINUX := $(VENV-BIN-PATH-LINUX)/pip3
REQUIREMENTS-FILE := requirements.txt
MAIN-FILE := main.py

ifeq ($(OS),Windows_NT)
    RMDIR := rmdir /s /q
	RMFILE := del
	SETUP-VENV := python -m venv $(VENV-PATH)
	PIP-VENV := $(PIP-VENV-WIN)
	PYTHON-VENV := $(PYTHON-VENV-WIN)
	VENV-BIN-PATH := $(VENV-BIN-PATH-WIN)
	PYINSTALLER-PATH := $(VENV-BIN-PATH)\pyinstaller
else
    RMDIR := rm -rf
	RMFILE := rm -f
	SETUP-VENV := python3 -m venv $(VENV-PATH)
	PIP-VENV := $(PIP-VENV-LINUX)
	PYTHON-VENV := $(PYTHON-VENV-LINUX)
	VENV-BIN-PATH := $(VENV-BIN-PATH-LINUX)
	PYINSTALLER-PATH := $(VENV-BIN-PATH)/pyinstaller
endif

.PHONY: install
install:
	$(SETUP-VENV)
	$(PIP-VENV) install -r $(REQUIREMENTS-FILE)

.PHONY: update-requirements
update-requirements:
	$(PIP-VENV) freeze > $(REQUIREMENTS-FILE)

.PHONY: build
build:
	$(PYINSTALLER-PATH) -D -F -n $(PROJECT-NAME) -w -y "$(MAIN-FILE)"

.PHONY: clean
clean:
	$(RMDIR) dist
	$(RMDIR) build
	$(RMFILE) $(PROJECT-NAME).spec
	$(RMDIR) $(VENV-PATH)