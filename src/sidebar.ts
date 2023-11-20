import * as vscode from "vscode";
import { execSync } from "child_process";

export class DistroboxContainersProvider
    implements vscode.TreeDataProvider<Container>
{
    constructor(private workspaceRoot: string | undefined) {}

    private _onDidChangeTreeData: vscode.EventEmitter<
        Container | undefined | null | void
    > = new vscode.EventEmitter<Container | undefined | null | void>();

    readonly onDidChangeTreeData: vscode.Event<
        Container | undefined | null | void
    > = this._onDidChangeTreeData.event;

    getTreeItem(element: Container): vscode.TreeItem {
        return element;
    }

    getChildren(element?: Container): Thenable<Container[]> {
        return Promise.resolve(this.getDistroboxContainers());
    }

    private getDistroboxContainers(): Container[] {
        let containers: Container[] = [];
        const out = execSync("distrobox list --no-color | tail -n +2", {
            encoding: "utf-8",
        });
        for (const line of out.trim().split("\n")) {
            const info: string[] = line
                .trim()
                .split("|")
                .map((item) => {
                    return item.trim();
                });
            containers.push(
                new Container(
                    info[0],
                    info[1],
                    info[2],
                    info[3],
                    vscode.TreeItemCollapsibleState.None
                )
            );
        }
        return containers;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}

export class Container extends vscode.TreeItem {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public status: string,
        public readonly image: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(name, collapsibleState);
        this.tooltip = `${this.name} (${this.status})`;
        this.description = this.status;

        if (status.startsWith("Up")) {
            this.iconPath = new vscode.ThemeIcon("run");
        } else if (status.startsWith("Exited")) {
            this.iconPath = new vscode.ThemeIcon("primitive-square");
        } else {
            this.iconPath = new vscode.ThemeIcon("dash");
        }
    }

    contextValue = "container";
}
