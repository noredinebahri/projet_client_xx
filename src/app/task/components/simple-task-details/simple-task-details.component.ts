import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReferenceObject, TaskDetails} from '@task/model/task';

type SingleProperty = { key: string, value: unknown };

interface PairOfProperties {
  prop1: SingleProperty,
  prop2?: SingleProperty
}

@Component({
  selector: 'psm-simple-task-details',
  templateUrl: './simple-task-details.component.html',
  styleUrls: ['./simple-task-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleTaskDetailsComponent {
  @Input() details: TaskDetails | null | undefined;

  getPairsOfObjectProperties(referenceObject: ReferenceObject): PairOfProperties[] {
    return Object.keys(referenceObject)
      .reduce<PairOfProperties[]>((pairs, currentPropertyKey) => {
        const currentProperty: SingleProperty = {key: currentPropertyKey, value: referenceObject[currentPropertyKey]};
        const lastPair = pairs.length > 0 ? pairs[pairs.length - 1] : null;
        if (lastPair && !lastPair.prop2) {
          lastPair.prop2 = currentProperty;
        } else {
          pairs.push({prop1: currentProperty});
        }
        return pairs;
      }, []);
  }

  bothPropertiesPresentOf(pair: PairOfProperties) {
    return !!(pair.prop1 && pair.prop2);
  }

  copyToClipboard(value: unknown) {
    navigator.clipboard.writeText('' + value);
  }
}
