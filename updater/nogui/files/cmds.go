package files

import (
	"os"
)

func (*FileSync) DeleteAfter(appDir string, objects []string) error {
	for _, obj := range objects {
		err := os.RemoveAll(appDir + obj)
		if err != nil {
			return err
		}
	}
	return nil
}
