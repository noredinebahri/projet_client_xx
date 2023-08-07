import {MapState} from '@shared/map/model';

const psmEditorUrlPrefix = `edit/index.html#background=MAPNIK&disable_features=boundaries&`;
const defaultTarget = 'map=12.09/53.0828/8.8251';

export class MapEditorService {
  private mapEditorWindow: WindowProxy | null = null;

  openAt(target: MapState) {
    this.doOpen(`map=${target.zoom}/${target.lat}/${target.long}`);
  }

  openAndSelectObject(objectId: string) {
    this.doOpen(`id=${objectId}`);
  }

  open() {
    this.doOpen(defaultTarget);
  }

  private doOpen(mapOrIdQueryParam: string) {
    const psmEditorUrl = `${psmEditorUrlPrefix}${mapOrIdQueryParam}`; // passing by the router as PSM Editor is a standalone application
    // if (!this.mapEditorWindow) {
    //   window.addEventListener('beforeunload', (event) => {
    //     // Cancel the event as stated by the standard.
    //     event.preventDefault();
    //     // Chrome requires returnValue to be set.
    //     event.returnValue = 'Are you sure?';
    //   });
    //   window.addEventListener('unload', ev => {
    //     console.log('Closing parent', ev);
    //     this.mapEditorWindow?.focus();
    //     this.mapEditorWindow?.close?.();
    //   });
    // }
    this.mapEditorWindow = window.open(psmEditorUrl, 'PSMEditor', 'fullscreen=yes');
    if (this.mapEditorWindow) {
      this.mapEditorWindow.location.href = psmEditorUrl;
      this.mapEditorWindow.location.reload();
      this.mapEditorWindow?.focus();
    }
  }
}
