package archive

import (
	"archive/zip"
	"errors"
	"io"
	"os"
	"path/filepath"
	"runtime"
)

type Archive struct{}

func NewArchive() *Archive {
	return &Archive{}
}

func (arch *Archive) ExtractArchive(archiveFile, dest string) error {
	os := runtime.GOOS
	switch os {
	case "windows", "linux":
		return arch.unzip(archiveFile, dest)
	default:
		return errors.New("unsupported operating system")
	}
}

func (arch *Archive) unzip(zipFile, dest string) error {
	r, err := zip.OpenReader(zipFile)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer rc.Close()

		path := filepath.Join(dest, f.Name)

		if f.FileInfo().IsDir() {
			os.MkdirAll(path, f.Mode())
		} else {
			os.MkdirAll(filepath.Dir(path), os.ModePerm)
			f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
			if err != nil {
				return err
			}
			defer f.Close()

			_, err = io.Copy(f, rc)
			if err != nil {
				return err
			}
		}
	}

	return nil
}
