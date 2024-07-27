package main

import (
	"flag"
	"log"
	"mdupdater/archive"
	"mdupdater/files"
	"mdupdater/process"
	"strconv"
	"strings"
)

func main() {
	appFullPathDir := flag.String("APP_FULL_PATH_DIR", "", "")
	closeAppsBeforePidsList := flag.String("CLOSE_APPS_BEFORE_PIDS_LIST", "", "")
	archiveFileFullPath := flag.String("ARCHIVE_FILE_FULL_PATH", "", "")
	updateDirectoryName := flag.String("UPDATE_DIR", "", "")
	filesIgnoreList := flag.String("FILES_IGNORE_LIST", "", "")
	filesDeleteAfterList := flag.String("FILES_DELETE_AFTER_LIST", "", "")

	flag.Parse()

	if *appFullPathDir == "" || *closeAppsBeforePidsList == "" || *archiveFileFullPath == "" || *updateDirectoryName == "" || *filesIgnoreList == "" || *filesDeleteAfterList == "" {
		log.Fatalln("You must specify values for the variables APP_FULL_PATH_DIR, CLOSE_APPS_BEFORE_PIDS_LIST, ARCHIVE_FILE_FULL_PATH, UPDATE_DIR, FILES_IGNORE_LIST and FILES_DELETE_AFTER_LIST.")
		return
	}

	var ignoreList []string = strings.Split(*filesIgnoreList, ",")
	var deleteAfterList []string = strings.Split(*filesDeleteAfterList, ",")
	var closeAppsBeforePids []int
	for _, i := range strings.Split(*closeAppsBeforePidsList, ",") {
		j, err := strconv.Atoi(i)
		if err != nil {
			log.Fatalln(err)
		}
		closeAppsBeforePids = append(closeAppsBeforePids, j)
	}

	archive := archive.NewArchive()
	fileSync := files.NewFileSync(*appFullPathDir+*updateDirectoryName, *appFullPathDir, ignoreList)

	err := archive.ExtractArchive(*archiveFileFullPath, *appFullPathDir)
	if err != nil {
		log.Fatalf("archive extraction error: %v\n", err)
		return
	}

	_process_ := process.NewProcess()
	for _, val := range closeAppsBeforePids {
		processKillErr := _process_.Kill(int64(val))
		if processKillErr != nil {
			log.Fatalln(processKillErr)
		}
	}

	err = fileSync.SyncFiles()
	if err != nil {
		log.Fatalf("file update error: %v\n", err)
		return
	}

	delErr := fileSync.DeleteAfter(*appFullPathDir, deleteAfterList)
	if (delErr) != nil {
		log.Fatalf("error when deleting objects: %v\n", delErr)
		return
	}

	log.Println("file update was successful.")
}
