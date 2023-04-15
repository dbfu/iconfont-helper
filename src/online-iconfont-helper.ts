import { ExtensionContext, ViewColumn, WebviewPanel, window } from 'vscode';
import { getOnlineHtml } from './utils';

export class OnlineIconFontHelper {
  serverUrl: string;
  webviewPanel: WebviewPanel | undefined;
  context: ExtensionContext;

  constructor(context: ExtensionContext, serverUrl: string) {
    this.serverUrl = serverUrl;
    this.context = context;
  }

  public start() {
    this.openWebview(
      getOnlineHtml(
        this.context,
        this.serverUrl
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
      this.webviewPanel.onDidDispose(() => {
        this.webviewPanel = undefined;
      });
    } else {
      this.webviewPanel.reveal(columnToShowIn);
    }

    this.webviewPanel.webview.html = html;
  }



}