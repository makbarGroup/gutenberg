/**
 * WordPress dependencies
 */
import { Modal, CheckboxControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import './style.scss';

const MODAL_NAME = 'edit-post/options';

const Section = ( { title, children } ) => (
	<section className="edit-post-options__section">
		<h2 className="edit-post-options__section-title">
			{ title }
		</h2>
		{ children }
	</section>
);

export function OptionsModal( {
	isModalActive,
	toggleModal,
	isPublishSidebarEnabled,
	setIsPublishSidebarEnabled,
	areTipsEnabled,
	setAreTipsEnabled,
	isStatusPanelEnabled,
	setIsStatusPanelEnabled,
	isCategoriesPanelEnabled,
	setIsCategoriesPanelEnabled,
	isTagsPanelEnabled,
	setIsTagsPanelEnabled,
	isFeaturedImagePanelEnabled,
	setIsFeaturedImagePanelEnabled,
	isExcerptPanelEnabled,
	setIsExcerptPanelEnabled,
	isDiscussionPanelEnabled,
	setIsDiscussionPanelEnabled,
} ) {
	if ( ! isModalActive ) {
		return null;
	}

	const title = (
		<span className="edit-post-options__title">
			{ __( 'Options' ) }
		</span>
	);

	return (
		<Modal
			className="edit-post-options"
			title={ title }
			closeLabel={ __( 'Close' ) }
			onRequestClose={ toggleModal }
		>
			<Section title={ __( 'General' ) }>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Enable Pre-publish Checks' ) }
					checked={ isPublishSidebarEnabled }
					onChange={ setIsPublishSidebarEnabled }
				/>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Enable Tips' ) }
					checked={ areTipsEnabled }
					onChange={ setAreTipsEnabled }
				/>
			</Section>
			<Section title={ __( 'Document Panels' ) }>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Status & Visibility' ) }
					checked={ isStatusPanelEnabled }
					onChange={ setIsStatusPanelEnabled }
				/>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Categories' ) }
					checked={ isCategoriesPanelEnabled }
					onChange={ setIsCategoriesPanelEnabled }
				/>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Tags' ) }
					checked={ isTagsPanelEnabled }
					onChange={ setIsTagsPanelEnabled }
				/>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Featured Image' ) }
					checked={ isFeaturedImagePanelEnabled }
					onChange={ setIsFeaturedImagePanelEnabled }
				/>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Excerpt' ) }
					checked={ isExcerptPanelEnabled }
					onChange={ setIsExcerptPanelEnabled }
				/>
				<CheckboxControl
					className="edit-post-options__option"
					label={ __( 'Discussion' ) }
					checked={ isDiscussionPanelEnabled }
					onChange={ setIsDiscussionPanelEnabled }
				/>
			</Section>
		</Modal>
	);
}

export default compose( [
	withSelect( ( select ) => {
		const { isModalActive, isEditorSidebarPanelEnabled } = select( 'core/edit-post' );
		const { isPublishSidebarEnabled } = select( 'core/editor' );
		const { areTipsEnabled } = select( 'core/nux' );

		return {
			isModalActive: isModalActive( MODAL_NAME ),
			isPublishSidebarEnabled: isPublishSidebarEnabled(),
			areTipsEnabled: areTipsEnabled(),
			isStatusPanelEnabled: isEditorSidebarPanelEnabled( 'post-status' ),
			isCategoriesPanelEnabled: isEditorSidebarPanelEnabled( 'taxonomy-panel-category' ),
			isTagsPanelEnabled: isEditorSidebarPanelEnabled( 'taxonomy-panel-post_tag' ),
			isFeaturedImagePanelEnabled: isEditorSidebarPanelEnabled( 'featured-image' ),
			isExcerptPanelEnabled: isEditorSidebarPanelEnabled( 'post-excerpt' ),
			isDiscussionPanelEnabled: isEditorSidebarPanelEnabled( 'discussion-panel' ),
		};
	} ),
	withDispatch( ( dispatch, { isModalActive } ) => {
		const { openModal, closeModal, enablePanel, disablePanel } = dispatch( 'core/edit-post' );
		const { enablePublishSidebar, disablePublishSidebar } = dispatch( 'core/editor' );
		const { enableTips, disableTips } = dispatch( 'core/nux' );

		const buildSetIsPanelEnabled = ( panel ) => ( isEnabled ) => {
			if ( isEnabled ) {
				enablePanel( panel );
			} else {
				disablePanel( panel );
			}
		};

		return {
			toggleModal() {
				if ( isModalActive ) {
					closeModal();
				} else {
					openModal( MODAL_NAME );
				}
			},
			setIsPublishSidebarEnabled( isEnabled ) {
				if ( isEnabled ) {
					enablePublishSidebar();
				} else {
					disablePublishSidebar();
				}
			},
			setAreTipsEnabled( isEnabled ) {
				if ( isEnabled ) {
					enableTips();
				} else {
					disableTips();
				}
			},
			setIsStatusPanelEnabled: buildSetIsPanelEnabled( 'post-status' ),
			setIsCategoriesPanelEnabled: buildSetIsPanelEnabled( 'taxonomy-panel-category' ),
			setIsTagsPanelEnabled: buildSetIsPanelEnabled( 'taxonomy-panel-post_tag' ),
			setIsFeaturedImagePanelEnabled: buildSetIsPanelEnabled( 'featured-image' ),
			setIsExcerptPanelEnabled: buildSetIsPanelEnabled( 'post-excerpt' ),
			setIsDiscussionPanelEnabled: buildSetIsPanelEnabled( 'discussion-panel' ),
		};
	} ),
] )( OptionsModal );
