/* eslint-disable @typescript-eslint/naming-convention */
import { ExtensionContext, Position, Range, Uri, ViewColumn, WebviewPanel, window, workspace } from 'vscode';

import * as path from 'path';
import * as fs from 'fs';
import * as t from '@babel/types';

import { parse as babelParse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import { parse } from '@vue/compiler-dom';

import { getIndexHtml, getLoadingHtml } from '../utils';
import { vueService } from './service';
import { getIconComponentName, getSvgComponent } from './svg-template';
import { EventData, EventMessage, Icon } from '../interface';

export class VueIconfontHelper {

  webviewPanel: WebviewPanel | undefined;
  context: ExtensionContext;
  favorites: Icon[] = [];
  projectIcons: Icon[] = [];
  localIcons: Icon[] = [];
  antdIcons: Icon[] = [];
  projectRootPath: string | undefined;
  iconsDirPath: string | undefined;
  currentTextDocumentFileUri: Uri | undefined;
  currentPositon: Position | undefined;
  fileType: string;
  dirPath: string;
  importPath: string;

  constructor(context: ExtensionContext) {
    this.context = context;

    this.fileType = workspace.getConfiguration().get('iconfont.fileType') as string || 'tsx';
    this.dirPath = workspace.getConfiguration().get('iconfont.dirPath') as string || '/src/assets/icons';
    this.importPath = workspace.getConfiguration().get('iconfont.importPath') as string || '@/assets/icons';

    this.projectRootPath = workspace.workspaceFolders?.[0]?.uri?.fsPath;
    this.iconsDirPath = path.join(this.projectRootPath || '', `./${this.dirPath}`);
    this.currentTextDocumentFileUri = window.activeTextEditor?.document.uri;
    this.currentPositon = window.activeTextEditor?.selection.active;
  }

  public async start() {

    if (!this.projectRootPath) {
      window.showErrorMessage('请先打开一个项目');
      return;
    };

    this.openWebview(getLoadingHtml(this.context));
    this.localIcons = await vueService.getLocalIcons(this.iconsDirPath!);

    this.openWebview(
      getIndexHtml(
        this.context,
        this.localIcons,
      )
    );
  }

  private openWebview(html: string) {
    const columnToShowIn = window.activeTextEditor
      ? window.activeTextEditor.viewColumn
      : ViewColumn.Active;

    if (!this.webviewPanel) {
      this.webviewPanel = window.createWebviewPanel(
        'iconfont',
        "图标助手",
        columnToShowIn || ViewColumn.Active,
        {
          retainContextWhenHidden: true,
          enableScripts: true
        }
      );
      this.webviewPanel.webview.onDidReceiveMessage((e) => this.didReceiveMessage(e));
      this.webviewPanel.onDidDispose(() => {
        this.webviewPanel = undefined;
      });
    } else {
      this.webviewPanel.reveal(columnToShowIn);
    }

    this.webviewPanel.webview.html = html;
  }

  private async selectHandle(data: EventData) {

    let curIcon: Icon | undefined;
    let curComponentName: string;

    if (data.active === 'local') {
      curIcon = this.localIcons.find(o => o.id === data.icon.id);
      curComponentName = getIconComponentName(curIcon?.name || '');
    } else if (data.active === 'favorite') {
      curIcon = this.favorites.find(o => o.id === data.icon.id);
    } else if (data.active === 'project') {
      curIcon = this.projectIcons.find(o => o.id === data.icon.id);
    } else if (data.active === 'antd') {
      curIcon = this.antdIcons.find(o => o.id === data.icon.id);
    } else {
      return;
    }

    if (!curIcon) {
      return;
    }

    if (data.active === 'antd') {
      curComponentName = curIcon.code;
    }

    if (data.active !== 'local' && data.active !== 'antd') {
      if (this.localIcons.some(i => i.code === curIcon?.code)) {
        const option = await window.showInformationMessage(
          `${curIcon.code}，该名称本地已存在`,
          { modal: true },
          ...['使用本地', '修改名称']
        );

        if (!option) {
          return;
        }

        if (option === '使用本地') {
          data.icon.id = curIcon.code;
          this.selectHandle({
            active: 'local',
            icon: data.icon,
          });
          return;
        } else if (option === '修改名称') {

          const newName = await window.showInputBox({
            value: curIcon.code,
            valueSelection: [curIcon.code.length, curIcon.code.length],
          });

          if (newName) {
            curIcon.code = newName;
          } else {
            return;
          }
        }
      }

      if (!fs.existsSync(this.iconsDirPath!)) {
        window.showWarningMessage('检测到icons文件夹不存在，已为你自动创建。');
        fs.mkdirSync(this.iconsDirPath!);
      }

      const fullFilePath = path.join(this.iconsDirPath!, `./${curIcon?.code}.vue`);
      const { fileContent, componentName } = getSvgComponent(curIcon, data.icon.svg, data.icon.style);
      curComponentName = componentName;
      fs.writeFileSync(fullFilePath, fileContent);
    }

    if (this.currentTextDocumentFileUri && this.currentPositon) {
      const document = await window.showTextDocument(
        this.currentTextDocumentFileUri,
        { selection: new Range(this.currentPositon, this.currentPositon) }
      );

      document.edit(editBuilder => {

        let importAst;
        let exist = false;
        let loc = new Position(0, 0);

        const fileContent = document.document.getText();
        const compiled = parse(fileContent);
        const script: any = compiled.children.find((o: any) => o.tag === 'script');

        if (script) {
          const scriptCode = script.children?.[0].content;
          loc = script.children?.[0].loc ? new Position(script.children?.[0].loc.end.line - 1, 0) : loc;

          if (!scriptCode) {
            return;
          }

          const ast = babelParse(scriptCode, {
            sourceType: "module",
            plugins: [
              "jsx",
              [
                "decorators",
                {
                  "decoratorsBeforeExport": true
                }
              ],
              "typescript",
            ],
          });

          traverse(ast, {
            ImportDeclaration: (path) => {
              const { node } = path;
              exist = node.specifiers.some((spec: any) => spec.local.name === curComponentName);

              if (exist) {
                path.stop();
                return;
              }

              if (data.active === 'antd' && node.source.value === '@ant-design/icons-vue') {
                node.specifiers.push(
                  t.importSpecifier(
                    t.identifier(curComponentName),
                    t.identifier(curComponentName)
                  )
                );

                importAst = path.node;
              }
            }
          });
        }

        if (!exist) {
          if (importAst) {
            const importCode = generate(importAst).code;
            const { loc } = importAst as t.ImportSpecifier;
            if (loc && data.active === 'antd') {
              const range = new Range(
                new Position(loc.start.line - 1, loc.start.column),
                new Position(loc.end.line - 1, loc.end.column),
              );
              editBuilder.replace(range, importCode);
            }
          } else {
            if (data.active === 'antd') {
              editBuilder.insert(loc, `import { ${curComponentName} } from '@ant-design/icons-vue'\n`);
            } else {
              editBuilder.insert(loc, `import ${curComponentName} from '${this.importPath}/${curIcon!.code}.vue'\n`);
            }
          }
        }
        editBuilder.insert(this.currentPositon!, `<${curComponentName} />`);
      });
    }

    this.webviewPanel?.dispose();
  }

  private async didReceiveMessage(e: EventMessage) {
    const { type, data } = e;
    if (type === 'select') {
      this.selectHandle(data);
    } else if (type === 'getProjectIcons') {
      this.projectIcons = await vueService.getProject();
      this.webviewPanel?.webview?.postMessage(this.projectIcons);
    } else if (type === 'getFavoriteIcons') {
      this.favorites = await vueService.getFavorites();
      this.webviewPanel?.webview?.postMessage(this.favorites);
    } else if (type === 'getAntdIcons') {
      this.antdIcons = vueService.getAntdIcons();
      this.webviewPanel?.webview?.postMessage(this.antdIcons);
    } else if (type === 'getLocalIcons') {
      this.localIcons = await vueService.getLocalIcons(this.iconsDirPath!);
      this.webviewPanel?.webview?.postMessage(this.localIcons);
    }
  }
}