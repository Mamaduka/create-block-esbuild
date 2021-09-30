/**
 * WordPress dependencies
 */
 const { __ } = wp.i18n;
 const { useBlockProps } = wp.blockEditor;

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save() {
	return (
		<p { ...useBlockProps.save() }>
			{ __(
				'Hello from the saved content!',
				'create-block-esbuild'
			) }
		</p>
	);
}
