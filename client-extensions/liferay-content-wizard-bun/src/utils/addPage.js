import {
    getBannerDefinition,
    getFragmentDefinition,
    getRowDefinition,
} from './definitionUtils';

export function createJSON(jsonAI) {
    const pageElements = [];

    for (const component of JSON.parse(jsonAI)) {
        if (component.name) {
            const pageElement = getPageElement(component.name);

            if (pageElement) {
                pageElements.push(pageElement);
            }
        } else {
            const innerPageElements = [];

            for (const innerComponent of component.components) {
                const pageElement = getPageElement(innerComponent.name);

                if (pageElement) {
                    innerPageElements.push(pageElement);
                }
            }

            pageElements.push(getRowDefinition(innerPageElements));
        }
    }

    return getPageBody(pageElements);
}

function getPageBody(pageElements) {
    return {
        pageDefinition: {
            pageElement: {
                id: crypto.randomUUID(),
                pageElements,
                type: 'Root',
            },
        },
        title: 'Generated Page',
    };
}

function getPageElement(name) {
    switch (name) {
        case 'button': {
            return getFragmentDefinition('BASIC_COMPONENT-button');
        }

        case 'header': {
            return getFragmentDefinition('NAVIGATION_BARS-header-light');
        }

        case 'heading': {
            return getFragmentDefinition('BASIC_COMPONENT-heading');
        }

        case 'hero banner': {
            return getBannerDefinition();
        }

        case 'image': {
            return getFragmentDefinition('BASIC_COMPONENT-image');
        }

        case 'carousel': {
            return getFragmentDefinition('BASIC_COMPONENT-slider');
        }

        case 'card': {
            return getFragmentDefinition('BASIC_COMPONENT-card');
        }
        case 'video': {
            return getFragmentDefinition('BASIC_COMPONENT-external-video');
        }

        case 'social': {
            return getFragmentDefinition('BASIC_COMPONENT-social');
        }

        case 'paragraph': {
            return getFragmentDefinition('BASIC_COMPONENT-paragraph');
        }

        case 'footer': {
            return getFragmentDefinition('FOOTERS-footer-nav-light');
        }

        default:
            return null;
    }
}
