import ClayForm, { ClayInput } from '@clayui/form';
import ClayLayout from '@clayui/layout';
import ClayIcon from '@clayui/icon';
import ClayButton from '@clayui/button';
import { TreeView } from '@clayui/core';
import { UseFormReturn } from 'react-hook-form';
import DropDown, { Align } from '@clayui/drop-down';
import ClayModal, { useModal } from '@clayui/modal';

import { Schema } from '../AIWizard';
import useSWR from 'swr';
import { Liferay } from '../../services/liferay';
import { useMemo, useRef, useState } from 'react';

type Props = {
  form: UseFormReturn<Schema>;
  onSubmit: (data: Schema) => void;
  placeholder: string;
};

const FileExplorer = ({ selectedTree, setSelectedTree }: any) => {
  const { data: response } = useSWR('/documents/graphql/fwefwef', async () => {
    const response = await Liferay.Util.fetch('/o/graphql', {
      body: JSON.stringify({
        query: `query Documents {
            documents(siteKey: "${Liferay.ThemeDisplay.getScopeGroupId()}", flatten: true) {
              items {
                contentUrl
                fileName
                folder {
                    id
                    name
                  }
                id
              }
              totalCount
            }
          }`,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  });

  const documentAndFolders = useMemo(() => {
    const items = response?.data?.documents?.items ?? [];
    const folderStructure = {} as any;

    for (const item of items) {
      const folderId = item.folder.name;
      const folder = folderStructure[folderId];

      if (folder) {
        folderStructure[folderId].push(item);
      } else {
        folderStructure[folderId] = [item];
      }
    }

    const newItems = [];

    for (const folder in folderStructure) {
      const documents = folderStructure[folder] as any[];

      newItems.push({
        children: documents.map((document) => ({
          image: document.contentUrl,
          name: document.fileName,
          id: document.id,
        })),
        name: folder,
        type: 'folder',
      });
    }

    return newItems;
  }, [response]);

  return (
    <TreeView
      defaultItems={documentAndFolders}
      nestedKey='children'
      selectionMode='single'
    >
      {(item) => (
        <TreeView.Item onClick={() => setSelectedTree(item)}>
          <TreeView.ItemStack>
            <ClayIcon
              aria-label='Stack icon'
              symbol={item.type ? item.type : 'folder'}
            />
            {item.name}
          </TreeView.ItemStack>
          <TreeView.Group items={item.children}>
            {({ image, name }) => (
              <TreeView.Item>
                {image && (
                  <img
                    width={18}
                    height={18}
                    className='rounded-circle'
                    src={image}
                  />
                )}

                {name}
              </TreeView.Item>
            )}
          </TreeView.Group>
        </TreeView.Item>
      )}
    </TreeView>
  );
};

export default function ChatInput(props: Props) {
  const [files, setFiles] = useState([]);
  const [selectedTree, setSelectedTree] = useState();
  const { handleSubmit, formState, register, watch } = props.form;
  const formRef = useRef<HTMLFormElement>(null);
  const modal = useModal();
  const text = watch('input');

  console.log({ selectedTree });

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      if (!event.shiftKey && text.trim() !== '') {
        event.preventDefault();
        formRef.current?.requestSubmit();
      }
    }
  };

  const onChoose = () => {};

  return (
    <>
      {modal.open && (
        <ClayModal observer={modal.observer}>
          <ClayModal.Header>
            <ClayModal.Title>
              Choose the Documents and Media Files
            </ClayModal.Title>
          </ClayModal.Header>
          <ClayModal.Body>
            <FileExplorer
              selectedTree={selectedTree}
              setSelectedTree={setSelectedTree}
            />
          </ClayModal.Body>
          <ClayModal.Footer
            last={
              <>
                <ClayButton
                  className='mr-2'
                  onClick={modal.onClose}
                  displayType='secondary'
                >
                  Cancel
                </ClayButton>

                <ClayButton onClick={onChoose}>Choose</ClayButton>
              </>
            }
          />
        </ClayModal>
      )}

      <ClayLayout.ContentRow className='w-100'>
        <ClayLayout.ContentCol expand>
          <ClayForm
            ref={formRef}
            className='d-flex w-100'
            onSubmit={handleSubmit(props.onSubmit)}
          >
            <ClayInput
              {...register('input')}
              value={text}
              onKeyDown={handleKeyDown}
              component='textarea'
              disabled={formState.isSubmitting || formState.isLoading}
              placeholder={
                props.placeholder ||
                'Ask the Assistant to create a Liferay Asset'
              }
            />
          </ClayForm>
        </ClayLayout.ContentCol>
        <ClayLayout.ContentCol>
          <ClayLayout.ContentSection>
            <ClayButton.Group>
              <DropDown
                alignmentPosition={Align.BottomLeft}
                trigger={
                  <ClayButton
                    borderless
                    disabled={formState.isSubmitting || formState.isLoading}
                  >
                    <ClayIcon
                      color='gray'
                      aria-label='Submit Prompt'
                      symbol='upload-multiple'
                    />
                  </ClayButton>
                }
              >
                <DropDown.ItemList>
                  <DropDown.Item
                    onClick={() => {
                      console.log('Click');
                      modal.onOpenChange(true);
                    }}
                  >
                    <ClayIcon
                      className='mr-2'
                      aria-label='Picture Icon'
                      symbol='picture'
                    />
                    Choose from Docs & Media
                  </DropDown.Item>
                  <DropDown.Item>
                    <ClayIcon className='mr-2' symbol='display' />
                    Upload from your computer
                  </DropDown.Item>
                </DropDown.ItemList>
              </DropDown>

              <ClayButton
                disabled={formState.isSubmitting || formState.isLoading}
                displayType='primary'
                onClick={handleSubmit(props.onSubmit)}
              >
                <ClayIcon
                  aria-label='Submit Prompt'
                  symbol='order-arrow-right'
                />
              </ClayButton>
            </ClayButton.Group>
          </ClayLayout.ContentSection>
        </ClayLayout.ContentCol>
      </ClayLayout.ContentRow>
    </>
  );
}
