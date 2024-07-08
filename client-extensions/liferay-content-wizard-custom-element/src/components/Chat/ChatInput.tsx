import ClayForm, { ClayInput } from '@clayui/form';
import ClayIcon from '@clayui/icon';
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
    <ClayForm className='d-flex w-100' onSubmit={handleSubmit(props.onSubmit)}>
      <ClayInput
        {...register('input')}
        disabled={formState.isSubmitting || formState.isLoading}
        placeholder={props.placeholder || 'Write your answer'}
      />

      <ClayIcon
        color='gray'
        style={{ marginLeft: -30, marginTop: 14 }}
        aria-label='Submit Prompt'
        symbol='order-arrow-right'
      />
    </ClayForm>
  );
}
