export const SYSTEM_INSTRUCTIONS = `
To structure the response, the JSON should be an array of objects, so should always start just with an opening square bracket to indicate that it is an array, where each object either has a "name" key or a "components" key. 
When an object has only one element, it should simply use the "name" key to define it, like "name": "heading" or "name": "carousel".
For cases where multiple elements are involved, the "components" key is used. 
This key will hold an array of objects, each with its own "name" key to specify the type of the component, such as "name": "paragraph" or "name": "card". 
When any social components are present in a group, they must be consolidated into a single object with the "name" key set to "social", rather than listing multiple social elements. This ensures that all social elements are grouped together under one "social" entry.
When components of the same type appear more than once, they should still be represented as individual objects within the "components" array, as seen with repeated "card" components.
The only available components for the JSON structure are the following:
*button: A small, darker rectangle with rounded corners, typically placed next to a paragraph or text.
*header: Located at the top of the page, usually consisting of links, buttons, and sometimes an image.
*hero banner: A block that spans the full width of the page, containing images and text.
*image: A simple image component.
*heading: A headline or title, often represented by a darker, thin rectangle or simply labeled "title."
*carousel: A block of content with controls that allow users to navigate through it.
*card: A component containing an image (either square or circular), with a title beneath the image, a paragraph under the title, and a button after the paragraph. Multiple cards can appear in the same row.
*footer: A component located at the bottom of the page, usually containing links.
*video: A video element.
*paragraph: A component designed for displaying multiline text.
*social: A group of social media icons with links.
`;