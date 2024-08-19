import crypto from 'crypto';

export function getBannerDefinition() {
	return {
		definition: {
			fragmentStyle: {
				backgroundColor: 'gray500Color',
				borderWidth: '0',
				paddingBottom: '10',
				paddingTop: '10',
				textAlign: 'center'
			},
			fragmentViewports: [
				{
					fragmentViewportStyle: {
						paddingLeft: '4',
						paddingRight: '4'
					},
					id: 'landscapeMobile'
				},
				{
					fragmentViewportStyle: {
						paddingLeft: '3',
						paddingRight: '3'
					},
					id: 'portraitMobile'
				},
				{
					fragmentViewportStyle: {
						paddingLeft: '5',
						paddingRight: '5'
					},
					id: 'tablet'
				}
			],
			layout: {
				borderWidth: 0,
				paddingBottom: 0,
				paddingTop: 0,
				widthType: 'Fluid'
			}
		},
		pageElements: [
			{
				definition: {
					fragmentStyle: {
						paddingLeft: '10',
						paddingRight: '10'
					},
					fragmentViewports: [
						{
							fragmentViewportStyle: {
								paddingLeft: '0',
								paddingRight: '0'
							},
							id: 'portraitMobile'
						},
						{
							fragmentViewportStyle: {
								paddingLeft: '5',
								paddingRight: '5'
							},
							id: 'tablet'
						}
					],
					layout: {
						borderWidth: 0,
						paddingLeft: 0,
						paddingRight: 0,
						widthType: 'Fixed'
					}
				},
				pageElements: [
					{
						definition: {
							fragment: {
								key: 'BASIC_COMPONENT-heading'
							},
							fragmentConfig: {
								headingLevel: 'h1'
							},
							fragmentFields: [
								{
									id: 'element-text',
									value: {
										fragmentLink: {
											value_i18n: {}
										},
										text: {
											value_i18n: {
												en_US: 'Banner Title Example'
											}
										}
									}
								}
							],
							fragmentStyle: {
								marginBottom: '4',
								marginLeft: '10',
								marginRight: '10',
								textColor: 'whiteColor'
							},
							fragmentViewports: [
								{
									fragmentViewportStyle: {
										marginLeft: '0',
										marginRight: '0'
									},
									id: 'tablet'
								}
							]
						},
						type: 'Fragment'
					},
					{
						definition: {
							fragment: {
								key: 'BASIC_COMPONENT-paragraph'
							},
							fragmentConfig: {},
							fragmentFields: [
								{
									id: 'element-text',
									value: {
										fragmentLink: {
											value_i18n: {}
										},
										text: {
											value_i18n: {
												en_US: '<span class="lead">This is a simple banner component that you can use when you need extra attention to featured content or information.</span>'
											}
										}
									}
								}
							],
							fragmentStyle: {
								fontSize: 'fontSizeLg',
								marginBottom: '4',
								marginLeft: '10',
								marginRight: '10',
								textColor: 'whiteColor'
							},
							fragmentViewports: [
								{
									fragmentViewportStyle: {
										marginBottom: '4',
										marginLeft: '0',
										marginRight: '0'
									},
									id: 'tablet'
								}
							]
						},
						type: 'Fragment'
					},
					{
						definition: {
							fragment: {
								key: 'BASIC_COMPONENT-button'
							},
							fragmentConfig: {
								buttonSize: 'nm',
								buttonType: 'primary'
							},
							fragmentFields: [
								{
									id: 'link',
									value: {
										fragmentLink: {
											value_i18n: {}
										}
									}
								}
							],
							fragmentStyle: {
								marginLeft: '10',
								marginRight: '10'
							},
							fragmentViewports: [
								{
									fragmentViewportStyle: {
										marginLeft: '0',
										marginRight: '0'
									},
									id: 'tablet'
								}
							]
						},
						type: 'Fragment'
					}
				],
				type: 'Section'
			}
		],
		type: 'Section'
	};
}

function getColumnDefinition(size, pageElements) {
	return {
		definition: {
			size
		},
		id: crypto.randomUUID(),
		pageElements,
		type: 'Column'
	};
}

export function getFragmentDefinition(fragmentKey) {
	return {
		definition: {
			fragment: {key: fragmentKey},
			fragmentConfig: {},
			fragmentFields: []
		},
		id: crypto.randomUUID(),
		type: 'Fragment'
	};
}

export function getRowDefinition(pageElements) {
	let columns = [];

	for (const pageElement of pageElements) {
		columns.push(
			getColumnDefinition(12 / pageElements.length, [pageElement])
		);
	}

	return {
		definition: {
			gutters: true,
			numberOfColumns: columns.length
		},
		id: crypto.randomUUID(),
		pageElements: columns,
		type: 'Row'
	};
}