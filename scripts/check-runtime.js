const [major] = process.versions.node.split('.').map(Number);

if (!major || Number.isNaN(major)) {
  console.error(`Unable to determine Node.js major version from '${process.versions.node}'.`);
  process.exit(1);
}

if (major < 25) {
  console.error(
    [
      `Node.js ${process.versions.node} is not supported.`,
      'This repository requires Node.js 25 or newer for native TypeScript support.',
      "Run 'nvm use' (or switch your local runtime) before installing dependencies.",
    ].join('\n')
  );
  process.exit(1);
}
