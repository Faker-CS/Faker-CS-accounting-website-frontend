import React, { useState, useEffect } from 'react';

import { Box, Divider, Collapse } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DemandesRowPanel } from './demandes-row-panel';
import { DemandesFileItem } from './demandes-file-item';

export function DemandeListRow({ document, onDeleteItem, onDownloadItem }) {
  const files = useBoolean();
  const upload = useBoolean();
  const [userDocuments, setUserDocuments] = useState([]);

  useEffect(() => {
    if (document.user_document) {
      if (Array.isArray(document.user_document)) {
        setUserDocuments(document.user_document);
      } else if (typeof document.user_document === 'object') {
        setUserDocuments([document.user_document]);
      } else {
        setUserDocuments([]);
      }
    } else {
      setUserDocuments([]);
    }
  }, [document]);
  return (
    <>
      <DemandesRowPanel
        title={document.name}
        filesNumber={document.user_document.length}
        onOpen={upload.onTrue}
        collapse={files.value}
        onCollapse={files.onToggle}
      />
      <Collapse in={!files.value} unmountOnExit>
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          }}
          gap={3}
        >
          {userDocuments.map((file) => (
            <DemandesFileItem
              key={file.id}
              onDelete={() => onDeleteItem(file.id)}
              onDownload={() => onDownloadItem(file.id)}
              sx={{ maxWidth: 'auto' }}
              file={file}
            />
          ))}
        </Box>
      </Collapse>
          <Divider sx={{ my: 5, borderStyle: 'dashed' }} />
    </>
  );
}