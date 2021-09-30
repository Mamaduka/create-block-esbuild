const esbuild = require( 'esbuild' );

const args = process.argv.slice( 2 );

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
}).catch(() => process.exit(1))
