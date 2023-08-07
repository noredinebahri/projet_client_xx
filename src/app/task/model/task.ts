import {BoundingBox} from '@shared/map/model';
import {GeoJSON} from 'geojson'

export interface TaskTo {
  taskNumber: string;
  type: string;
  status: TaskStatus;
  reportedBy: string;
  assignedTo?: string | null;
  createdAt: string | null;
  lastChangedAt: string | null;
}

export interface Task extends Omit<TaskTo, 'createdAt' | 'lastChangedAt'> {
  createdAt: Date | null;
  lastChangedAt: Date | null;
}

export type ReferenceObject = { [key: string]: unknown; };

export interface TaskDetailsTo extends TaskTo {
  description?: string | null;
  referenceObjects?: (ReferenceObject | MapElementReferenceObject)[] | null;
  bbox?: BoundingBox;
  comments?: TaskCommentTo[];
}

export interface TaskDetails extends Task {
  description?: string | null;
  referenceObjects?: (ReferenceObject | MapElementReferenceObject)[] | null;
  bbox?: BoundingBox;
  comments?: TaskComment[];
}

export interface TaskCommentTo {
  id?: number;
  createdAt?: string;
  createdBy?: string;
  text: string;
}

export interface TaskComment extends Omit<TaskCommentTo, 'createdAt'> {
  id?: number;
  createdAt?: Date | null;
  createdBy?: string;
  text: string;
}

export interface MapElementReferenceObject extends ReferenceObject {
  name: string;
  psmObjectId: string;
  psmObjectType: 'node' | 'way' | 'relation';
  geoJson?: GeoJSON;
}

export interface TaskSearchCriteria {
  type?: string;
  status?: TaskStatus;
}

export type TaskStatus = 'Open' | 'In Progress' | 'Closed';

export type TaskProperty = keyof TaskDetails;

export interface TaskChange {
  taskNumber: string;
  changedProperty: TaskProperty;
}
