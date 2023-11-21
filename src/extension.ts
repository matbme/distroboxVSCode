import * as vscode from "vscode";
import { Container, DistroboxContainersProvider } from "./sidebar";
import { attachToContainer, startContainer, stopContainer } from "./containers";

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
    vscode.commands.registerCommand("distroboxvscode.start", (c: Container) => {
        startContainer(c.name);
        distroboxContainersProvider.refresh();
    });
    vscode.commands.registerCommand("distroboxvscode.stop", (c: Container) => {
        stopContainer(c.name);
        distroboxContainersProvider.refresh();
    });
    vscode.commands.registerCommand("distroboxvscode.attach", (c: Container) =>
        attachToContainer(c.name)
    );
}
