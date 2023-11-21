import * as vscode from "vscode";
import { Container, DistroboxContainersProvider } from "./sidebar";
import { attachToContainer, startContainer, stopContainer } from "./containers";

export function activate(context: vscode.ExtensionContext) {
    // Set sort mode if undefined
    if (!context.globalState.get("sortMode")) {
        context.globalState.update("sortMode", "alphabetically");
    }

    // Register sort mode context
    vscode.commands.executeCommand(
        "setContext",
        "distroboxvscode.sortMode",
        context.globalState.get("sortMode")
    );

    // Register data provider for tree view
    const distroboxContainersProvider = new DistroboxContainersProvider(context);
    vscode.window.registerTreeDataProvider(
        "distrobox",
        distroboxContainersProvider
    );

    // Register commands
    // UI commands
    vscode.commands.registerCommand(
        "distroboxvscode.refreshContainersList",
        () => distroboxContainersProvider.refresh()
    );
    vscode.commands.registerCommand("distroboxvscode.setAlphaSortMode", () => {
        context.globalState.update("sortMode", "alphabetically");
        vscode.commands.executeCommand(
            "setContext",
            "distroboxvscode.sortMode",
            "alphabetically"
        );
        distroboxContainersProvider.refresh();
    });
    vscode.commands.registerCommand("distroboxvscode.setStateSortMode", () => {
        context.globalState.update("sortMode", "state");
        vscode.commands.executeCommand(
            "setContext",
            "distroboxvscode.sortMode",
            "state"
        );
        distroboxContainersProvider.refresh();
    });
    // Containers commands
    vscode.commands.registerCommand("distroboxvscode.start", (c: Container) => {
        startContainer(c.name);
        distroboxContainersProvider.refresh();
    });
    vscode.commands.registerCommand("distroboxvscode.stop", (c: Container) => {
        stopContainer(c.name);
        distroboxContainersProvider.refresh();
    });
    vscode.commands.registerCommand(
        "distroboxvscode.attach",
        (c: Container) => {
            if (c.contextValue !== "running-container") {
                startContainer(c.name);
                distroboxContainersProvider.refresh();
            }
            attachToContainer(c.name);
        }
    );
}
