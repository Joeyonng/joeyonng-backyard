const path = require('path');

module.exports = {
  title: 'React Big Sur',
  exampleMode: 'collapse',
  usageMode: 'expand',
  tocMode: 'expand',
  pagePerSection: true,
  sortProps: props => props,
  moduleAliases: {
    'react-big-sur': path.resolve(__dirname, 'src'),
    'icons': path.resolve(__dirname, 'src', 'icons'),
  },
  styles: path.resolve(__dirname, 'styleguide.styles.js'),
  styleguideDir: 'build',
  ribbon: {
    url: 'https://github.com/Joeyonng/react-big-sur',
    text: 'GitHub'
  },
  sections: [
    {
      name: 'react-big-sur',
      sectionDepth: 1,
      content: './src/introduction.md'
    },
    {
      name: 'System Capabilities',
      sectionDepth: 2,
      external: true,
      href: 'https://developer.apple.com/design/human-interface-guidelines/macos/system-capabilities/auto-save/',
      sections: [
        {
          name: 'Dock',
          sectionDepth: 1,
          content: './src/components/docks/docks.md',
        },
        {
          name: 'Notification Center',
          sectionDepth: 1,
          content: './src/components/notification-centers/notification-centers.md',
        },
        {
          name: 'Control Center',
          sectionDepth: 1,
          content: './src/components/control-centers/control-centers.md',
        },
      ]
    },
    {
      name: 'Windows and Views',
      sectionDepth: 2,
      external: true,
      href: 'https://developer.apple.com/design/human-interface-guidelines/macos/windows-and-views/',
      sections: [
        {
          name: 'Windows',
          sectionDepth: 1,
          content: './src/components/windows/windows.md',
        },
        {
          name: 'Column Views',
          sectionDepth: 1,
          content: './src/components/column-views/column-views.md',
        },
        {
          name: 'Toolbars',
          sectionDepth: 1,
          content: './src/components/toolbars/toolbars.md',
        },
      ]
    },
    {
      name: 'Menus',
      sectionDepth: 2,
      external: true,
      href: 'https://developer.apple.com/design/human-interface-guidelines/macos/menus/',
      sections: [
        {
          name: 'All Menus',
          sectionDepth: 1,
          content: './src/components/menus/menus.md',
        },
      ]
    },
    {
      name: 'Buttons',
      sectionDepth: 2,
      external: true,
      href: 'https://developer.apple.com/design/human-interface-guidelines/macos/buttons/',
      sections: [
        {
          name: 'Push Buttons',
          sectionDepth: 1,
          content: './src/components/push-buttons/push-buttons.md',
        },
        {
          name: 'Help Buttons',
          sectionDepth: 1,
          content: './src/components/help-buttons/help-buttons.md',
        },
      ]
    },
    {
      name: 'Selectors',
      sectionDepth: 2,
      external: true,
      href: 'https://developer.apple.com/design/human-interface-guidelines/macos/selectors/',
      sections: [
        {
          name: 'Segmented Controls',
          sectionDepth: 1,
          content: './src/components/segmented-controls/segmented-controls.md',
        },
        {
          name: 'Sliders',
          sectionDepth: 1,
          content: './src/components/sliders/sliders.md',
        },
      ]
    },
    {
      name: 'Indicators',
      sectionDepth: 2,
      external: true,
      href: 'https://developer.apple.com/design/human-interface-guidelines/macos/indicators/',
      sections: [
        {
          name: 'Progress Indicators',
          sectionDepth: 1,
          content: './src/components/progress-indicators/progress-indicators.md',
        },
      ]
    },
    {
      name: 'Miscellaneous',
      sectionDepth: 2,
      external: true,
      sections: [
        {
          name: 'Lists',
          sectionDepth: 1,
          content: './src/components/lists/lists.md',
        },
        {
          name: 'Traffic Lights',
          sectionDepth: 1,
          content: './src/components/traffic-lights/traffic-lights.md',
        },
        {
          name: 'Tooltip',
          sectionDepth: 1,
          content: './src/components/tooltips/tooltips.md',
        },
        {
          name: 'Circular Bar',
          sectionDepth: 1,
          content: './src/components/circular-bars/circular-bars.md',
        },
      ]
    },
    {
      name: 'Component API',
      components: './src/components/**/*.{js,jsx,ts,tsx}',
    },
  ],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.(s?)css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|jpeg|webp|gif)$/,
          use: ['url-loader'],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        },
      ]
    },
  },
}
