import { useState } from 'react';
import Card from '@clayui/card';
import { Text } from '@clayui/core';
import classNames from 'classnames';
import ClayIcon from '@clayui/icon';
import Icon from '@clayui/icon';
import LoadingIndicator from '@clayui/loading-indicator';

import { Liferay } from '../services/liferay';
import { assets } from '../utils/assets';
import { Message as MessageType } from '../types';
import { useAppContext } from '../context/AppContext';
import React from 'react';

const ASSETS_BASE_LIMIT = 4;
const ASSETS_BASE_LIMIT_FULLSCREEN = 5;

type ModalContentProps = {
  isLoadingContent: boolean;
  fullscreen: boolean;
  messages: any[];
  onSelectAsset: (asset: any) => void;
};

const Asset = ({ asset, onSelectionClick, isLoadingContent }: any) => (
  <div className='option-col mt-0 mb-3'>
    <Card className='cursor-pointer ai-prompt-option'>
      <Card.Body
        onClick={() => (isLoadingContent ? null : onSelectionClick(asset))}
      >
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
  const { myUserAccount } = useAppContext();

  console.log({ myUserAccount });

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

      <div className='optionContainer'>{children}</div>

      {role === 'user' && (
        <img
          className='rounded-circle ml-3'
          width={32}
          height={32}
          src={myUserAccount?.image || '/image/user_portrait'}
        />
      )}
    </div>
  );
};

const More = ({
  setAssetCount,
  fullscreen,
  isLoadingContent,
}: {
  fullscreen: boolean;
  isLoadingContent: boolean;
  setAssetCount: React.Dispatch<number>;
}) => (
  <Asset
    isLoadingContent={isLoadingContent}
    asset={{ title: 'More', icon: 'plus' }}
    onSelectionClick={() =>
      setAssetCount(
        (assetCount) =>
          assetCount +
          (fullscreen ? ASSETS_BASE_LIMIT_FULLSCREEN : ASSETS_BASE_LIMIT)
      )
    }
  />
);

export default function ModalContent({
  isLoadingContent,
  fullscreen,
  messages,
  onSelectAsset,
}: ModalContentProps) {
  const [assetCount, setAssetCount] = useState(ASSETS_BASE_LIMIT);

  return (
    <>
      <div
        className={classNames({
          disabled: isLoadingContent,
        })}
      >
        <Message role='assistant'>
          <b>
            Hi {Liferay.ThemeDisplay.getUserName()}! What would you like to
            generate?
          </b>
          <br />
          Suggested content (choose one):
          <div className='d-flex flex-wrap mt-3 row'>
            {assets
              .filter((_, index) => index < assetCount)
              .map((asset, index) => (
                <Asset
                  asset={asset}
                  isLoadingContent={isLoadingContent}
                  key={index}
                  onSelectionClick={onSelectAsset}
                />
              ))}

            {assetCount < assets.length && (
              <More
                fullscreen={fullscreen}
                isLoadingContent={isLoadingContent}
                setAssetCount={setAssetCount}
              />
            )}
          </div>
        </Message>
      </div>

      {messages.map((message, index) => (
        <Message key={index} role={message.role}>
          {React.isValidElement(message.text) ? (
            message.text
          ) : (
            <span dangerouslySetInnerHTML={{ __html: message.text }} />
          )}
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
