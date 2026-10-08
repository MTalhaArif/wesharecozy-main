export type ThreadSummary = {
  id: string;
  listingId: string;
  titleEn: string;
  titleTr: string;
  photoUrl: string;
  otherName: string;
  lastText: string;
  updatedAt: number;
};
export type ThreadMessage = {
  id: string;
  senderUid: string;
  text: string;
  createdAt: number;
};
