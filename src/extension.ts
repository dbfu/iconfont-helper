// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { reactService } from './react/service';
import { ReactIconfontHelper } from './react/iconfont-helper';
import { getProjectType } from './utils';
import { VueIconfontHelper } from './vue/iconfont-helper';
import { vueService } from './vue/service';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('iconfont-helper.select_icon', async () => {
		const cookie = vscode.workspace.getConfiguration().get('iconfont.cookie') as string;

		if (!cookie) {
			vscode.window.showErrorMessage('请先配置cookie');
			return;
		}

		reactService.setCookie(cookie);
		vueService.setCookie(cookie);

		const projectType = getProjectType(vscode.window.activeTextEditor?.document.uri.fsPath || '');
		if (projectType === 'vue') {
			const iconfontHelper = new VueIconfontHelper(context);
			iconfontHelper.start();
			return;
		}

		

		const iconfontHelper = new ReactIconfontHelper(context);
		iconfontHelper.start();
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
