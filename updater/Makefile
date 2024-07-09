GO := go
BINARY_NAME := updater
BUILD_PATH := build

ifeq ($(OS),Windows_NT)
	BINARY_NAME := $(BINARY_NAME).exe
	BINARY_PATH := $(BUILD_PATH)/$(BINARY_NAME)
	CLEAN := rd /s /q $(BUILD_PATH)
else
	BINARY_NAME := $(BINARY_NAME)
	BINARY_PATH := $(BUILD_PATH)/$(BINARY_NAME)
	CLEAN := rm -rf $(BUILD_PATH)
endif

.PHONY: build
build:
	$(GO) build -o $(BINARY_PATH)

.PHONY: build-amd64
build-amd64:
	GOARCH=amd64 $(GO) build -o $(BINARY_PATH)

.PHONY: build-arm64
build-arm64:
	GOARCH=arm64 $(GO) build -o $(BINARY_PATH)

.PHONY: clean
clean:
	$(CLEAN)