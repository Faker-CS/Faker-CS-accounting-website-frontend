import { toast } from 'sonner';
import { useRef, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';

import { useBoolean } from 'src/hooks/use-boolean';

import { fetchDocuments } from 'src/actions/documents';

import { FileManagerFolderItem } from './file-manager-folder-item';

// ----------------------------------------------------------------------

export function FileManagerGridView({ table, dataFiltered, canEdit }) {
  const { selected, onSelectRow: onSelectItem } = table;

  const [foldersWithFiles, setFoldersWithFiles] = useState([]);

  useEffect(() => {
    const loadFolderData = async () => {
      try {
        // Use Promise.all to await all asynchronous calls within map
        const updatedFolders = await Promise.all(
          dataFiltered.map(async (folder) => {
            const totalFiles = await fetchDocuments(4, folder.id); // Fetch the files for each folder
            return {
              ...folder,
              totalFiles: totalFiles.length, // Add totalFiles to the folder data
            };
          })
        );
  
        setFoldersWithFiles(updatedFolders); // Set the updated folder data to state
      } catch (error) {
        toast.error('Erreur lors de compter!');
      }
    };
  
    loadFolderData();
  }, [dataFiltered]);
  

  const folders = useBoolean();

  const containerRef = useRef(null);


  return (
    <Box ref={containerRef}>
        <Collapse in={!folders.value} unmountOnExit>
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
          >
            {foldersWithFiles
              .filter((i) => i.type === 'folder')
              .map((folder) => (
                <FileManagerFolderItem
                  key={folder.id}
                  folder={folder}
                  selected={selected.includes(folder.id)}
                  onSelect={() => onSelectItem(folder.id)}
                  canEdit={canEdit}
                  sx={{ maxWidth: 'auto' }}
                />
              ))}
          </Box>
        </Collapse>
      </Box>
  );
}