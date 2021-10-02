const esbuild = require( 'esbuild' );
const path = require( 'path' );
const fs = require( 'fs' );
const json2php = require( 'json2php' );

const args = process.argv.slice( 2 );

const WORDPRESS_NAMESPACE = '@wordpress/';

/**
 * Given a string, returns a new string with dash separators converted to
 * camelCase equivalent. This is not as aggressive as `_.camelCase` in
 * converting to uppercase, where Lodash will also capitalize letters
 * following numbers.
 *
 * @param {string} string Input dash-delimited string.
 * @return {string} Camel-cased string.
 */
 function camelCaseDash( string ) {
	return string.replace( /-([a-z])/g, ( _, letter ) => letter.toUpperCase() );
}

/**
 * Based on https://github.com/evanw/esbuild/issues/337#issuecomment-706765332.
 */
const DependencyExtractionPlugin = {
	name: 'dependency-extraction',
	setup( build ) {
		const options = build.initialOptions
		const deps = [ 'wp-element' ];

		build.onResolve( { filter: /^@wordpress\// }, ( args ) => ({
			path: args.path,
			namespace: 'wp-globals',
		}));

		build.onLoad({ filter: /.*/, namespace: 'wp-globals' }, ( { path } ) => {
			const package = path.substring(WORDPRESS_NAMESPACE.length)
			const name = camelCaseDash( package );

			// Store dependencies for later.
			deps.push( `wp-${package}` );

			return {
				contents: `module.exports = window["wp"][${JSON.stringify(name)}]`,
			}
		});

		build.onEnd( () => {
			const data = {
				dependencies: Array.from( deps ).sort(),
				version: null,
			};

			const contents = `<?php return ${ json2php(
				JSON.parse( JSON.stringify( data ) )
			) };`;

			fs.writeFileSync( path.resolve( options.outdir, 'index.asset.php' ), contents );
		});
	},
}

esbuild.build({
	entryPoints: [
		'src/index.js',
		'src/style.css',
	],
	outdir: 'build',
	bundle: true,
	format: 'iife',
	platform: 'browser',
	loader: { '.js': 'jsx' },
	minify: args.includes('--minify'),
	watch: args.includes('--watch'),
	logLevel: 'info',
	jsxFactory: 'wp.element.createElement',
	jsxFragment: 'wp.element.Fragment',
	plugins: [DependencyExtractionPlugin],
}).catch(() => process.exit(1))
