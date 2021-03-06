import {autoinject, bindable} from 'aurelia-framework';
import {PluginManager}        from '../../shared/plugin-manager';

@autoinject()
export class Tiles {
  @bindable selectedProject;
  tiles = [];
  @bindable showIrrelevant = false;

  constructor(private pluginManager: PluginManager) {
  }

  selectedProjectChanged() {
    this.refreshTiles();
  }

  showIrrelevantChanged() {
    this.refreshTiles();
  }

  executeTile(tile) {
    console.log(tile);
    try {
      tile.currentViewModel.onClick().catch(err => {
        console.log(err);
      });
    }
    catch(err) {
      console.log(err);
    }
  }

  refreshTiles() {
    // remove all tiles from the screen
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      this.tiles.splice(i, 1);
    }

    // we're done if no project has been selected
    if (!this.selectedProject) {
      return;
    }

    // get a list of tiles to show from every plugin
    this.pluginManager.getTilesForPlugin(this.selectedProject, this.showIrrelevant)
    .forEach(plugin => this.tiles.push(plugin));
  }
}
