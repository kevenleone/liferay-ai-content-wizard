import { ComponentProps } from 'react';
import EmptyState from './EmptyState';

export default function WizardEmptyState(
  props: Omit<ComponentProps<typeof EmptyState>, 'imgSrc'>
) {
  return (
    <EmptyState
      {...props}
      imgSrc={new URL(import.meta.url).origin + '/wizard.svg'}
    />
  );
}
