import ClayForm, { ClayInput } from '@clayui/form';
import ClayLayout from '@clayui/layout';
import ClayIcon from '@clayui/icon';
import ClayButton from '@clayui/button';
import { UseFormReturn } from 'react-hook-form';

import { Schema } from '../AIWizard';

type Props = {
  form: UseFormReturn<Schema>;
  onSubmit: (data: Schema) => void;
  placeholder: string;
};

export default function ChatInput(props: Props) {
  const { handleSubmit, formState, register } = props.form;

  return (
    <>
      <ClayLayout.ContentRow className='w-100'>
        <ClayLayout.ContentCol expand>
          <ClayForm
            className='d-flex w-100'
            onSubmit={handleSubmit(props.onSubmit)}
          >
            <ClayInput
              {...register('input')}
              disabled={formState.isSubmitting || formState.isLoading}
              placeholder={props.placeholder || 'Write your answer'}
            />
          </ClayForm>
        </ClayLayout.ContentCol>
        <ClayLayout.ContentCol>
          <ClayLayout.ContentSection>
            <ClayButton.Group spaced>
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
        <ClayLayout.ContentCol>
          <svg
            className='lexicon-icon lexicon-icon-ellipsis-v'
            focusable='false'
            role='presentation'
          >
            <use href='/images/icons/icons.svg#ellipsis-v' />
          </svg>
        </ClayLayout.ContentCol>
      </ClayLayout.ContentRow>
    </>
  );
}
