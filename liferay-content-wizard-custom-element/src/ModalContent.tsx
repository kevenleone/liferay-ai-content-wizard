import ClayPanel from '@clayui/panel';
import Card from '@clayui/card';
import Icon from '@clayui/icon';

import { Liferay } from './services/liferay';

export default function ModalContent() {
  return (
    <>
      <div className='ai-options-panel'>
        <span>
          <Icon symbol='stars' />
        </span>
        <b>
          Hi {Liferay.ThemeDisplay.getUserName()}! What would you like to
          generate?
        </b>
        <br />
        Suggested content (choose one):
        <Card>
          <Card.Body>Option 1</Card.Body>
        </Card>
        <Card>
          <Card.Body>Option 2</Card.Body>
        </Card>
        [{Liferay.ThemeDisplay.getScopeGroupId()}]
      </div>
    </>
  );
}
