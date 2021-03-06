/**
 * WordPress dependencies
 */
import deprecated from '@wordpress/deprecated';

/**
 * Internal dependencies
 */
import {
	getEditorMode,
	getPreference,
	isEditorSidebarOpened,
	isEditorSidebarPanelOpened,
	isModalActive,
	isFeatureActive,
	isPluginSidebarOpened,
	getActiveGeneralSidebarName,
	isPluginItemPinned,
	getMetaBoxes,
	hasMetaBoxes,
	isSavingMetaBoxes,
	getMetaBox,
	getActiveMetaBoxLocations,
	isMetaBoxLocationActive,
} from '../selectors';

jest.mock( '@wordpress/deprecated', () => jest.fn() );

describe( 'selectors', () => {
	beforeEach( () => {
		deprecated.mockClear();
	} );

	describe( 'getEditorMode', () => {
		it( 'should return the selected editor mode', () => {
			const state = {
				preferences: { editorMode: 'text' },
			};

			expect( getEditorMode( state ) ).toEqual( 'text' );
		} );

		it( 'should fallback to visual if not set', () => {
			const state = {
				preferences: {},
			};

			expect( getEditorMode( state ) ).toEqual( 'visual' );
		} );
	} );

	describe( 'getPreference', () => {
		it( 'should return the preference value if set', () => {
			const state = {
				preferences: { chicken: true },
			};

			expect( getPreference( state, 'chicken' ) ).toBe( true );
		} );

		it( 'should return undefined if the preference is unset', () => {
			const state = {
				preferences: { chicken: true },
			};

			expect( getPreference( state, 'ribs' ) ).toBeUndefined();
		} );

		it( 'should return the default value if provided', () => {
			const state = {
				preferences: {},
			};

			expect( getPreference( state, 'ribs', 'chicken' ) ).toEqual( 'chicken' );
		} );
	} );

	describe( 'isEditorSidebarOpened', () => {
		it( 'should return false when the editor sidebar is not opened', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: true,
				},
				activeGeneralSidebar: null,
			};

			expect( isEditorSidebarOpened( state ) ).toBe( false );
		} );

		it( 'should return false when the editor sidebar is assigned but not opened', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: true,
				},
				activeGeneralSidebar: 'edit-post/document',
			};

			expect( isEditorSidebarOpened( state ) ).toBe( false );
		} );

		it( 'should return false when the plugin sidebar is opened', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: false,
				},
				activeGeneralSidebar: 'my-plugin/my-sidebar',
			};

			expect( isEditorSidebarOpened( state ) ).toBe( false );
		} );

		it( 'should return true when the editor sidebar is opened', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: false,
				},
				activeGeneralSidebar: 'edit-post/document',
			};

			expect( isEditorSidebarOpened( state ) ).toBe( true );
		} );
	} );

	describe( 'isPluginSidebarOpened', () => {
		it( 'should return false when the plugin sidebar is not opened', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: true,
				},
				activeGeneralSidebar: null,
			};

			expect( isPluginSidebarOpened( state ) ).toBe( false );
		} );

		it( 'should return false when the editor sidebar is opened', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: false,
				},
				activeGeneralSidebar: 'edit-post/document',
			};

			expect( isPluginSidebarOpened( state ) ).toBe( false );
		} );

		it( 'should return true when the plugin sidebar is opened', () => {
			const name = 'plugin-sidebar/my-plugin/my-sidebar';
			const state = {
				preferences: {
					isGeneralSidebarDismissed: false,
				},
				activeGeneralSidebar: name,
			};

			expect( isPluginSidebarOpened( state ) ).toBe( true );
		} );
	} );

	describe( 'getActiveGeneralSidebarName', () => {
		it( 'returns null if dismissed', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: true,
				},
				activeGeneralSidebar: 'edit-post/block',
			};

			expect( getActiveGeneralSidebarName( state ) ).toBe( null );
		} );

		it( 'returns active general sidebar', () => {
			const state = {
				preferences: {
					isGeneralSidebarDismissed: false,
				},
				activeGeneralSidebar: 'edit-post/block',
			};

			expect( getActiveGeneralSidebarName( state ) ).toBe( 'edit-post/block' );
		} );
	} );

	describe( 'isModalActive', () => {
		it( 'returns true if the provided name matches the value in the preferences activeModal property', () => {
			const state = {
				activeModal: 'test-modal',
			};

			expect( isModalActive( state, 'test-modal' ) ).toBe( true );
		} );

		it( 'returns false if the provided name does not match the preferences activeModal property', () => {
			const state = {
				activeModal: 'something-else',
			};

			expect( isModalActive( state, 'test-modal' ) ).toBe( false );
		} );

		it( 'returns false if the preferences activeModal property is null', () => {
			const state = {
				activeModal: null,
			};

			expect( isModalActive( state, 'test-modal' ) ).toBe( false );
		} );
	} );

	describe( 'isEditorSidebarPanelOpened', () => {
		it( 'should return false if no panels preference', () => {
			const state = {
				preferences: {},
			};

			expect( isEditorSidebarPanelOpened( state, 'post-taxonomies' ) ).toBe( false );
		} );

		it( 'should return false if the panel value is not set', () => {
			const state = {
				preferences: { panels: {} },
			};

			expect( isEditorSidebarPanelOpened( state, 'post-taxonomies' ) ).toBe( false );
		} );

		it( 'should return the panel value', () => {
			const state = {
				preferences: { panels: { 'post-taxonomies': true } },
			};

			expect( isEditorSidebarPanelOpened( state, 'post-taxonomies' ) ).toBe( true );
		} );
	} );

	describe( 'isFeatureActive', () => {
		it( 'should return true if feature is active', () => {
			const state = {
				preferences: {
					features: {
						chicken: true,
					},
				},
			};

			expect( isFeatureActive( state, 'chicken' ) ).toBe( true );
		} );

		it( 'should return false if feature is not active', () => {
			const state = {
				preferences: {
					features: {
						chicken: false,
					},
				},
			};

			expect( isFeatureActive( state, 'chicken' ) ).toBe( false );
		} );

		it( 'should return false if feature is not referred', () => {
			const state = {
				preferences: {
					features: {
					},
				},
			};

			expect( isFeatureActive( state, 'chicken' ) ).toBe( false );
		} );
	} );

	describe( 'isPluginItemPinned', () => {
		const state = {
			preferences: {
				pinnedPluginItems: {
					'foo/pinned': true,
					'foo/unpinned': false,
				},
			},
		};

		it( 'should return true if the flag is not set for the plugin item', () => {
			expect( isPluginItemPinned( state, 'foo/unknown' ) ).toBe( true );
		} );

		it( 'should return true if plugin item is not pinned', () => {
			expect( isPluginItemPinned( state, 'foo/pinned' ) ).toBe( true );
		} );

		it( 'should return false if plugin item item is unpinned', () => {
			expect( isPluginItemPinned( state, 'foo/unpinned' ) ).toBe( false );
		} );
	} );

	describe( 'hasMetaBoxes', () => {
		it( 'should return true if there are active meta boxes', () => {
			const state = {
				activeMetaBoxLocations: [ 'side' ],
			};

			expect( hasMetaBoxes( state ) ).toBe( true );
		} );

		it( 'should return false if there are no active meta boxes', () => {
			const state = {
				activeMetaBoxLocations: [],
			};

			expect( hasMetaBoxes( state ) ).toBe( false );
		} );
	} );

	describe( 'isSavingMetaBoxes', () => {
		it( 'should return true if some meta boxes are saving', () => {
			const state = {
				isSavingMetaBoxes: true,
			};

			expect( isSavingMetaBoxes( state ) ).toBe( true );
		} );

		it( 'should return false if no meta boxes are saving', () => {
			const state = {
				isSavingMetaBoxes: false,
			};

			expect( isSavingMetaBoxes( state ) ).toBe( false );
		} );
	} );

	describe( 'getMetaBoxes', () => {
		it( 'should return the state of all meta boxes', () => {
			const state = {
				activeMetaBoxLocations: [ 'normal', 'side' ],
			};

			const result = getMetaBoxes( state );

			expect( deprecated ).toHaveBeenCalled();
			expect( result ).toEqual( {
				normal: {
					isActive: true,
				},
				advanced: {
					isActive: false,
				},
				side: {
					isActive: true,
				},
			} );
		} );
	} );

	describe( 'getMetaBox', () => {
		it( 'should return the state of selected meta box', () => {
			const state = {
				activeMetaBoxLocations: [ 'side' ],
			};

			const result = getMetaBox( state, 'side' );

			expect( deprecated ).toHaveBeenCalled();
			expect( result ).toEqual( {
				isActive: true,
			} );
		} );
	} );

	describe( 'getActiveMetaBoxLocations', () => {
		it( 'should return the active meta boxes', () => {
			const state = {
				activeMetaBoxLocations: [ 'side' ],
			};

			const result = getActiveMetaBoxLocations( state, 'side' );

			expect( result ).toEqual( [ 'side' ] );
		} );
	} );

	describe( 'isMetaBoxLocationActive', () => {
		it( 'should return false if not active', () => {
			const state = {
				activeMetaBoxLocations: [],
			};

			const result = isMetaBoxLocationActive( state, 'side' );

			expect( result ).toBe( false );
		} );

		it( 'should return true if active', () => {
			const state = {
				activeMetaBoxLocations: [ 'side' ],
			};

			const result = isMetaBoxLocationActive( state, 'side' );

			expect( result ).toBe( true );
		} );
	} );
} );
