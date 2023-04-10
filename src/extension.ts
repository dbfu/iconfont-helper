// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "iconfont-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('iconfont-helper.helloWorld', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from iconfont-helper!');

		const { data } = await axios.get(`
		https://www.iconfont.cn/api/project/detail.json?pid=3220133&t=1681095136125
		`, {
			headers: {
				cookie: 'EGG_SESS_ICONFONT=LwyPfFe9mdLtPg5kAyRM2oKTWe0dYQN45w0qN-zVhK6dp-njsVT2v8vj0y7Na1xO_qxR0Q5yn44fvFMYv4dAbFkkPN7Q2SIT7WFQ5FO2LlIzfyHX470slziABzVIqyEbW2tX0WM3ctfgbmZAKVHD6vFbeS7M71RYmaRVot-TNA-ANZEZSNLe7zUPihEr2v3ULWeH64rLjXaWHzNSa1nBNw==; locale=zh-cn; ctoken=j9-Cx8-cLiXzHXKnngXrcjH3; u=4633697; u.sig=4fw53ePQ_Q86H6OmVfgAtYTz5rNLspZFRKSEXfl_siI; xlly_s=1; isg=BB0dLZMOJY-y_vrd5-jEcEjVLP8XOlGM_QRQBN_iR3Sjlj3Ip4hrXe4EwIqQVmlE'
			}
		});

		console.log(data);



	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
