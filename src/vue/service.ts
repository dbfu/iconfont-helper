import axios, { AxiosInstance } from 'axios';
import { window } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';
import * as React from 'react';
import { renderToString } from 'react-dom/server';

import { Icon } from '../interface';
import { toAwait } from '../utils';
import { antdIcons } from '../antd-icons';

export class VueService {

  request: AxiosInstance | undefined;

  public setCookie(cookie: string) {
    this.request = axios.create({
      baseURL: 'https://www.iconfont.cn',
      headers: {
        cookie,
      }
    });
  }

  public async getFavorites(): Promise<Icon[]> {
    const url = '/api/user/myfavorites.json';

    if (this.request) {
      const [error, data] = await toAwait(this.request.get(url));

      if (!error) {
        window.showErrorMessage('获取收藏图标出错!');
        return [];
      }

      const { favorites } = data;

      return favorites.map((item: any) => ({
        id: String(item.id),
        name: item.name,
        code: item.font_class,
        svgContent: item.show_svg,
      }));
    }

    return [];
  }

  public async getProject(): Promise<Icon[]> {
    const url = '/api/user/myprojects.json?page=1&isown_create=1&t=1681221740620';

    if (this.request) {
      const [error, data] = await toAwait(this.request.get(url));

      if (!error) {
        window.showErrorMessage('获取项目出错!');
        return [];
      }

      const { ownProjects } = data;

      const projectIcons = await Promise.all(
        ownProjects.map((p: any) => toAwait(
          this.request!.get<any>(`/api/project/detail.json`,
            {
              params: { pid: p.id },
            }
          )
        )));

      const allPrejectIcons = projectIcons
        .reduce((prev, [, cur]) => [...prev, ...cur.icons], [])
        .map((item: any) => ({
          id: String(item.id),
          name: item.name,
          svgContent: item.show_svg,
          code: item.font_class,
        }));

      return allPrejectIcons;
    }

    return [];
  }

  public async getLocalIcons(iconsDirPath: string) {
    if (!fs.existsSync(iconsDirPath)) {
      return [];
    }

    const files = fs.readdirSync(iconsDirPath);
    const icons = await Promise.all(
      files.map(
        fileName => this.getLocalIcon(path.join(iconsDirPath, `./${fileName}`), fileName)
      )
    );
    return icons;
  }

  private getLocalIcon(filePath: string, fileName: string): Promise<Icon> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, async (error, data) => {
        if (error) {
          reject();
          return;
        }

        const fileContent = data.toString('utf8');
        const [svgContent = ''] = fileContent.replace(/\n/g, '').match(/<svg (.+?)>(.+?)<\/svg>/g) || [];

        const lastIndex = fileName.lastIndexOf('.');
        const name = fileName.slice(0, lastIndex);
        resolve({
          name,
          id: String(name),
          svgContent,
          code: name,
        });
      });
    });
  }

  public getAntdIcons() {
    return antdIcons;
  }
}

export const vueService = new VueService();