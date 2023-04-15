
import { ExtensionContext } from 'vscode';

import * as fs from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';


import { Icon } from './interface';

export const getIndexHtml = (
  context: ExtensionContext,
  localIcons: Icon[],
) => {
  let html = fs.readFileSync(
    path.join(
      context.extensionPath, './src/html/index.ejs'
    )
  ).toString();

  html = ejs.render(html, { localIcons });
  return html;
};

export const getLoadingHtml = (
  context: ExtensionContext,
) => {
  let html = fs.readFileSync(
    path.join(
      context.extensionPath, './src/html/loading.ejs'
    )
  ).toString();

  html = ejs.render(html);
  return html;
};

export const getOnlineHtml = (
  context: ExtensionContext,
  serverUrl: string,
) => {
  let html = fs.readFileSync(
    path.join(
      context.extensionPath, './src/html/online.ejs'
    )
  ).toString();

  html = ejs.render(html, { serverUrl });
  return html;
};

export const getProjectType = (fileName: string): 'react' | 'vue' => {

  const extname = path.extname(fileName);

  if (extname === '.vue') {
    return 'vue';
  }

  return 'react';
};

export async function toAwait(promise: Promise<any>) {
  if (promise) {
    try {
      const { data: { data }, code } = await promise;
      if (code === 200) {
        return [false, data];
      } else {
        return [true, data];
      }
    } catch {
      return [true];
    }
  }
  return [true];
}