import { Container as ClayContainer } from '@clayui/layout';
import { ReactNode } from 'react';
import classNames from 'classnames';

export default function Container({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <ClayContainer
            className={classNames(
                'bg-white border-1 rounded p-4 mt-4',
                className
            )}
        >
            {children}
        </ClayContainer>
    );
}
