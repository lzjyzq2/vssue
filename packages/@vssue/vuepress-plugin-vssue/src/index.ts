import { Plugin } from 'vuepress-types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = ({ platform = 'github', ...options }): Plugin => {
  const platformAPI = {
    github: '@vssue/api-github-v3',
    'github-v4': '@vssue/api-github-v4',
    gitlab: '@vssue/api-gitlab-v4',
    bitbucket: '@vssue/api-bitbucket-v2',
    gitee: '@vssue/api-gitee-v5',
    gitea: '@vssue/api-gitea-v1'
  };

  const apiPkg = platformAPI[platform];

  if (!apiPkg) {
    throw new Error(
      `[@vssue/vuepress-plugin-vssue] Platform '${platform}' is not supported. Available platforms: ${Object.keys(
        platformAPI
      ).join(', ')}.`
    );
  }

  try {
    require.resolve(apiPkg);
  } catch (e) {
    throw new Error(
      `[@vssue/vuepress-plugin-vssue] ${apiPkg} is not installed. Run 'npm install ${apiPkg}' or 'yarn add ${apiPkg}' to install it.`
    );
  }

  return {
    name: 'vssue',

    enhanceAppFiles: [path.resolve(__dirname, 'enhanceApp.js')],

    define: {
      VSSUE_OPTIONS: JSON.stringify(options),
    },

    alias: {
      '@vssue/api$': require.resolve(apiPkg),
    },
  };
};
