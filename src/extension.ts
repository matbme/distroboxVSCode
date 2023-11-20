import * as vscode from "vscode";
import { Container, DistroboxContainersProvider } from "./sidebar";

export function activate(context: vscode.ExtensionContext) {
    const rootPath =
        vscode.workspace.workspaceFolders &&
        vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : undefined;

    const distroboxContainersProvider = new DistroboxContainersProvider(
        rootPath
    );
    vscode.window.registerTreeDataProvider(
        "distrobox",
        distroboxContainersProvider
    );

    vscode.commands.registerCommand(
        "distroboxvscode.refreshContainersList",
        () => distroboxContainersProvider.refresh()
    );

    // TODO: If container is stopped, start if befora calling attach
    vscode.commands.registerCommand(
        "distroboxvscode.attach",
        (c: Container) => {
            vscode.commands.executeCommand("remote-containers.attachToRunningContainerFromViewlet", c.name);
        }
    );
}
