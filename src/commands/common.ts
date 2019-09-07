'use strict';
import { commands, Disposable, TextDocumentShowOptions, TextEditor, Uri, window, workspace } from 'vscode';
import { BuiltInCommands } from '../constants';
import { Logger } from '../logger';

export type Commands = 'restoreEditors.clear' | 'restoreEditors.open' | 'restoreEditors.restore' | 'restoreEditors.save' | 'restoreEditors.showQuickEditors';
export const Commands = {
    Clear: 'restoreEditors.clear' as Commands,
    Open: 'restoreEditors.open' as Commands,
    Restore: 'restoreEditors.restore' as Commands,
    Save: 'restoreEditors.save' as Commands,
    ShowQuickEditors: 'restoreEditors.showQuickEditors' as Commands
};

export type CommandContext = 'restoreEditors:key';
export const CommandContext = {
    Key: 'restoreEditors:key' as CommandContext
};

export function setCommandContext(key: CommandContext | string, value: any) {
    return commands.executeCommand(BuiltInCommands.SetContext, key, value);
}

export abstract class Command extends Disposable {

    private _disposable: Disposable;

    constructor(command: Commands) {
        super(() => this.dispose());
        this._disposable = commands.registerCommand(command, this.execute, this);
        console.log("Constructor for ", command);
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    abstract execute(...args: any[]): any;
}

export async function openEditor(uri: Uri, options?: TextDocumentShowOptions): Promise<TextEditor | undefined> {
    try {
        const defaults: TextDocumentShowOptions = {
            preserveFocus: false,
            preview: true,
            viewColumn: (window.activeTextEditor && window.activeTextEditor.viewColumn) || 1
        };

        const document = await workspace.openTextDocument(uri);
        return window.showTextDocument(document, { ...defaults, ...(options || {}) });
    }
    catch (ex) {
        Logger.error(ex, 'openEditor');
        return undefined;
    }
}
