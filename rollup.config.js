import buble from "rollup-plugin-buble";
import resolve from "rollup-plugin-node-resolve";

function bundle(use) {
    return [
        {
            input: `src/${use}/index.js`,
            output: [
                { file: `${use}/cjs.js`, format: "cjs", sourcemap: true },
                {
                    file: `${use}/umd.js`,
                    format: "umd",
                    name: "cssthis",
                    sourcemap: true
                }
            ],
            external: [use],
            plugins: [
                resolve(),
                buble({
                    objectAssign: "Object.assign"
                })
            ]
        },
        {
            input: `src/${use}/index.js`,
            output: {
                file: `${use}/index.js`,
                format: "es",
                sourcemap: true
            },
            external: [use]
        }
    ];
}

export default [].concat(bundle("preact"), bundle("react"));
