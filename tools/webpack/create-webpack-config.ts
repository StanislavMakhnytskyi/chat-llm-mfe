import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { ModuleFederationPlugin } from '@module-federation/enhanced/webpack';
import type { Configuration, RuleSetRule } from 'webpack';

type WebpackMode = 'development' | 'production';

type RemoteMap = Record<string, string>;
type ExposeMap = Record<string, string>;

export interface CreateWebpackConfigOptions {
  name: string;
  appRoot: string;
  outputPath: string;
  htmlTemplate: string;
  port: number;
  tsConfigPath: string;
  remotes?: RemoteMap;
  exposes?: ExposeMap;
}

const cssRule: RuleSetRule = {
  test: /\.css$/i,
  use: [
    'style-loader',
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: path.resolve(process.cwd(), 'postcss.config.cjs')
        }
      }
    }
  ]
};

const tsRule: RuleSetRule = {
  test: /\.[jt]sx?$/i,
  exclude: /node_modules/,
  use: {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
      configFile: undefined as never
    }
  }
};

function resolveMode(mode?: WebpackMode): WebpackMode {
  if (mode === 'development' || mode === 'production') {
    return mode;
  }

  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
}

export function createWebpackConfig(options: CreateWebpackConfigOptions) {
  return (_env: unknown = {}, argv: { mode?: WebpackMode } = {}): Configuration => {
    const mode = resolveMode(argv.mode);
    const isProduction = mode === 'production';
    const federationName = options.name.replace(/-/g, '_');
    const tsLoaderRule: RuleSetRule = {
      ...tsRule,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: path.resolve(process.cwd(), options.tsConfigPath)
        }
      }
    };

    return {
      context: path.resolve(process.cwd(), options.appRoot),
      mode,
      target: 'web',
      entry: './src/main.tsx',
      output: {
        path: path.resolve(process.cwd(), options.outputPath),
        publicPath: 'auto',
        clean: true,
        uniqueName: federationName,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
      },
      devtool: isProduction ? 'source-map' : 'eval-source-map',
      resolve: {
        extensions: ['.tsx', '.ts', '.mjs', '.js', '.jsx', '.json'],
        alias: {
          '@chat/shared': path.resolve(process.cwd(), 'shared/src/index.ts')
        }
      },
      module: {
        rules: [tsLoaderRule, cssRule]
      },
      plugins: [
        new ModuleFederationPlugin({
          name: federationName,
          filename: 'static/js/remoteEntry.js',
          manifest: false,
          remotes: options.remotes,
          exposes: options.exposes,
          shared: {
            react: {
              singleton: true,
              eager: true,
              requiredVersion: false
            },
            'react-dom': {
              singleton: true,
              eager: true,
              requiredVersion: false
            },
            zustand: {
              singleton: true,
              eager: true,
              requiredVersion: false
            },
            '@chat/shared': {
              singleton: true,
              eager: true,
              requiredVersion: false
            }
          }
        }),
        new HtmlWebpackPlugin({
          template: path.resolve(process.cwd(), options.appRoot, options.htmlTemplate)
        })
      ],
      devServer: {
        port: options.port,
        host: 'localhost',
        hot: true,
        liveReload: true,
        historyApiFallback: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      optimization: {
        runtimeChunk: false
      }
    };
  };
}
