import { useState } from 'react';
import Card from '@clayui/card';
import { Text } from '@clayui/core';
import classNames from 'classnames';
import ClayIcon from '@clayui/icon';
import Icon from '@clayui/icon';
import LoadingIndicator from '@clayui/loading-indicator';

import { Liferay } from './services/liferay';
import { assets } from './utils/assets';
import { Message as MessageType } from './types';

const ASSETS_BASE_LIMIT = 4;

type ModalContentProps = {
  isLoadingContent: boolean;
  messages: any[];
  onSelectAsset: (asset: any) => void;
};

const Asset = ({ asset, onSelectionClick }: any) => (
  <div className='option-col mt-0 mb-3'>
    <Card className='cursor-pointer ai-prompt-option'>
      <Card.Body onClick={() => onSelectionClick(asset)}>
        <span
          className='icon-square'
          style={{
            border: '1px solid ' + asset.bgColor,
            backgroundColor: asset.bgColor + '22',
          }}
        >
          <ClayIcon color={asset.iconColor} symbol={asset.icon} />
        </span>
        <small className='font-weight-bold ml-2'>{asset.title}</small>
      </Card.Body>
    </Card>
  </div>
);

const Message = ({
  children,
  role,
}: {
  children: any;
} & Omit<MessageType, 'text'>) => {
  if (role === 'system') {
    return children;
  }

  return (
    <div
      className={classNames('d-flex rounded p-4 align-items-center', {
        'ai-options-panel': role === 'assistant',
        'justify-content-end ': role === 'user',
      })}
    >
      {role === 'assistant' && (
        <div className='mr-5'>
          <Icon color='blue' symbol='stars' />
        </div>
      )}

      <div>{children}</div>


      {role === 'user' && (
        <img
          className='rounded-circle ml-3'
          width={32}
          height={32}
          src='https://github.com/kevenleone.png'
        />
      )}
    </div>
  );
};

const More = ({ setAssetCount }: { setAssetCount: React.Dispatch<number> }) => (
  <Asset
    asset={{ title: 'More', icon: 'plus' }}
    onSelectionClick={() =>
      setAssetCount((assetCount) => assetCount + ASSETS_BASE_LIMIT)
    }
  />
);

export default function ModalContent({
  isLoadingContent,
  messages,
  onSelectAsset,
  
}: ModalContentProps) {
  const [assetCount, setAssetCount] = useState(ASSETS_BASE_LIMIT);

  async function onSelectionClick(asset:any) {

    messages.push({ text: 'I would like to create '+ asset.title + '.', role: 'user' });

    messages.push({
      text: "Tell me more about what you would like to create. Here is an example: "+
      "<i>Eg. " + asset.hint + "</i>",
      role: 'assistant',
    })

    onSelectAsset(asset);
  }

  return (
    <>
      <Message role='assistant'>
        <b>
          Hi {Liferay.ThemeDisplay.getUserName()}! What would you like to
          generate?
        </b>
        <br />
        Suggested content (choose one):
        <div className='d-flex flex-wrap mt-2 row'>
          {assets
            .filter((_, index) => index < assetCount)
            .map((asset, index) => (
              <Asset asset={asset} key={index} onSelectionClick={onSelectionClick} />
            ))}

          {assetCount < assets.length && <More setAssetCount={setAssetCount} />}
        </div>
      </Message>

      {messages.map((message, index) => (
        <Message key={index} role={message.role}>
          {message.text}
        </Message>
      ))}

      {isLoadingContent && (
        <Message role='assistant'>
          <div className='d-flex justify-content-center align-items-center w-100'>
            <Text color='secondary' italic>
              Content is being generated... be patient.
            </Text>

            <LoadingIndicator
              shape='squares'
              className='ml-2'
              size='sm'
              displayType='secondary'
              title='Content is being generated... be patient.'
            />
          </div>
        </Message>
      )}
    </>
  );
}
