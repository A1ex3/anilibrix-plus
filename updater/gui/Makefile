PROJECT-NAME := updater
BUILD_DIR := build
VENV-PATH := venv
PYTHON-VENV-WIN := .\$(VENV-PATH)\Scripts\python
PYTHON-VENV-LINUX := ./$(VENV-PATH)/bin/python3
PIP-VENV-WIN := .\$(VENV-PATH)\Scripts\pip3
PIP-VENV-LINUX := ./$(VENV-PATH)/bin/pip3
VENV-BIN-PATH-WIN := .\$(VENV-PATH)\Scripts
VENV-BIN-PATH-LINUX := ./$(VENV-PATH)/bin
REQUIREMENTS-FILE := requirements.txt
MAIN-FILE := main.py

ifeq ($(OS),Windows_NT)
    RMDIR := rmdir /s /q
	RMFILE := del
	SETUP-VENV := python -m venv $(VENV-PATH)
	PIP-VENV := $(PIP-VENV-WIN)
	PYTHON-VENV := $(PYTHON-VENV-WIN)
	VENV-BIN-PATH := $(VENV-BIN-PATH-WIN)
else
    RMDIR := rm -rf
	RMFILE := rm -f
	SETUP-VENV := python3 -m venv $(VENV-PATH)
	PIP-VENV := $(PIP-VENV-LINUX)
	PYTHON-VENV := $(PYTHON-VENV-LINUX)
	VENV-BIN-PATH := $(VENV-BIN-PATH-LINUX)
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
	$(VENV-BIN-PATH)/pyinstaller --onefile --noconsole --distpath $(BUILD_DIR) --name $(PROJECT-NAME) $(MAIN-FILE)

.PHONY: clean
clean:
	$(RMDIR) $(BUILD_DIR)
	$(RMFILE) $(PROJECT-NAME).spec
	$(RMDIR) $(VENV-PATH)