export interface TimelineEntry {
  ID: number;
  EventDescription: TimelineEntry.EventDescription,
  ContactIds: number[];
  CompanyIds: number[];
  JobIds: number[];
  OrderIds: number[];
  ProposalIds: number[];
  ProductionCardIds: number[];
  Event: string;
  Comment: string;
  EventType: TimelineEntry.EventType;
  Edited: boolean;
  EditedDate: Date | null;
  Deleted: boolean;
  DeletedDate: Date;
  Created: Date;
  CreeatedByUserId: number | null;
  CreatedByName: string;
  Details: TimelineEntry.Detail[];
}

export namespace TimelineEntry {
  /**
   * NOTE: EventType is not fully documented
   */
  export type EventType = 'ContactCreate' | 'CompanyEdit' | 'Comment' | 'Unkown';

  export type EventDescription = { [key in TimelineEntry.EventType]?: string };

  export interface Detail {
    Property: string;
    OldValue: string;
    NewValue: string;
    Date: Date | null;
  }
}
