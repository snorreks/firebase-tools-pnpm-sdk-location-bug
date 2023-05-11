import { build, type Loader, type PluginBuild } from 'esbuild';
import { readFileSync } from 'node:fs';
import { extname, dirname as _dirname } from 'node:path';

const nodeModules = new RegExp(
	/^(?:.*[\\/])?node_modules(?:\/(?!postgres-migrations).*)?$/,
);
// https://github.com/evanw/esbuild/issues/859
const dirnamePlugin = {
	name: 'dirname',

	setup(build: PluginBuild) {
		build.onLoad({ filter: /.*/ }, ({ path: filePath }) => {
			if (filePath.match(nodeModules)) {
				return;
			}
			let contents = readFileSync(filePath, 'utf8');
			const loader = extname(filePath).substring(1) as Loader;
			const dirname = _dirname(filePath);
			contents = contents
				.replace('__dirname', `"${dirname}"`)
				.replace('__filename', `"${filePath}"`);
			return {
				contents,
				loader,
			};
		});
	},
};

export const executeEsbuild = async (): Promise<void> => {

	const plugins = [dirnamePlugin];

	const result = await build({
		banner:  {
					js: "import{createRequire}from'module';const require=createRequire(import.meta.url);",
			  },
		bundle: true,
		entryPoints: ["app/src/index.ts"],
		format: 'esm',
		minify: true,
		sourcemap: true,
		treeShaking: true,
		outfile: 'app/dist/index.js',
		platform: 'node',
		plugins,
		tsconfig: 'app/tsconfig.json',
		target: 'node16',
		keepNames: false,
	});

	if (result.errors?.length) {
		throw new Error(result.errors[0]?.text);
	}
};

executeEsbuild();