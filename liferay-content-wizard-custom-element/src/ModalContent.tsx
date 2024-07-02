import Card from '@clayui/card';
import Icon from '@clayui/icon';

import { Liferay } from './services/liferay';
import ClayIcon from '@clayui/icon';
import classNames from 'classnames';

const navItems = [
  {
    description: 'Create a list of accounts based on a company type.',
    icon: 'community',
    iconColor: '#FF5733',
    bgColor: '#FF8973',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Accounts',
  },
  {
    description: 'Create a set of blogs based on a prompt.',
    icon: 'document',
    iconColor: '#33CF27',
    bgColor: '#89FF97',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Blogs',
  },
  {
    description: 'Create a taxonomy and category structure based on a theme.',
    icon: 'categories',
    iconColor: '#3357FF',
    bgColor: '#7389FF',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Categories',
  },
  {
    description: 'Create a set of multilingual FAQs based on a topic.',
    icon: 'book',
    iconColor: '#8E44AD',
    bgColor: '#BE93D4',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'FAQs',
  },
  {
    description:
      'Generate images into a document library folder based on a prompt.',
    icon: 'documents-and-media',
    iconColor: '#3498DB',
    bgColor: '#85C1E9',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Images',
  },
  {
    description: 'Create knowledge base folders and articles based on a topic.',
    icon: 'books',
    iconColor: '#16A085',
    bgColor: '#48C9B0',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Knowledge Base',
  },
  {
    description: 'Choose a topic to create message board sections and threads.',
    icon: 'message-boards',
    iconColor: '#D19403',
    bgColor: '#F7DC6F',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Message Boards',
  },
  {
    description: 'Create a set of multilingual news articles based on a topic.',
    icon: 'megaphone-full',
    iconColor: '#E74C3C',
    bgColor: '#F1948A',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'News',
  },
  {
    description: 'Populate a custom object with records based on a prompt.',
    icon: 'plus-squares',
    iconColor: '#7F8C8D',
    bgColor: '#B2BABB',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Objects',
  },
  {
    description: 'Create an organizational structure for a company.',
    icon: 'organizations',
    iconColor: '#2C3E50',
    bgColor: '#5D6D7E',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Organizations',
  },
  {
    description:
      'Generate a page hierarchy from a description of the goal of a site.',
    icon: 'page',
    iconColor: '#1ABC9C',
    bgColor: '#48C9B0',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Page Hierarchies',
  },
  {
    description: 'Use a company theme to generate products and categories.',
    icon: 'shopping-cart',
    iconColor: '#C0392B',
    bgColor: '#E74C3C',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Products',
  },
  {
    description: 'Create example users for a portal instance.',
    icon: 'user',
    iconColor: '#2980B9',
    bgColor: '#5499C7',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Users',
  },
  {
    description: 'Create example user groups for a portal instance.',
    icon: 'users',
    iconColor: '#D35400',
    bgColor: '#E59866',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'User Groups',
  },
  {
    description: 'Create a set of warehouses in a given region.',
    icon: 'truck',
    iconColor: '#8C8788',
    bgColor: '#CCD1D1',
    prompt:
      "I'd like to generate web contents about vegan recipes. 2 articles, each with 800 words, friendly tone, in English and Spanish.",
    title: 'Warehouses',
  },
  {
    description: 'Create a set of wiki nodes and pages based on a prompt.',
    icon: 'wiki-page',
    iconColor: '#A569BD',
    bgColor: '#D2B4DE',
    prompt:
      "I'd like to a wiki node about vegan recipes. 3 pages with 3 child pages each with 300 words, friendly tone, in English and Spanish.",
    title: 'Wikis',
  },
];

type ModalContentProps = {
  messages: any[];
  setMessages: React.Dispatch<any>;
};

const Message = ({
  children,
  role,
}: {
  children: any;
  role: 'assistant' | 'user';
}) => (
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

export default function ModalContent({
  messages,
  setMessages,
}: ModalContentProps) {
  return (
    <div>
      <Message role='assistant'>
        <b>
          Hi {Liferay.ThemeDisplay.getUserName()}! What would you like to
          generate?
        </b>
        <br />
        Suggested content (choose one):
        <div className='d-flex flex-wrap mt-2'>
          {navItems.map((navItem, index) => (
            <Card className='mr-2 mt-0 mb-3' key={index}>
              <Card.Body className=''>
                <span
                  className='icon-square'
                  style={{ border: '1px solid ' + navItem.bgColor }}
                >
                  <ClayIcon color={navItem.iconColor} symbol={navItem.icon} />
                </span>
                <span>{navItem.title}</span>
              </Card.Body>
            </Card>
          ))}
        </div>
      </Message>

      {messages.map((message, index) => (
        <Message key={index} role={message.role}>
          {message.text}
        </Message>
      ))}
    </div>
  );
}
