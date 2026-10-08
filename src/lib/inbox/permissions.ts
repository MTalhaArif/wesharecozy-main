export function assertThreadMember(members: unknown, uid: string) {
  if (!Array.isArray(members) || !members.includes(uid))
    throw new Error("Conversation not found");
}
export function assertListingOwner(
  ownerUid: unknown,
  uid: string,
  status: unknown,
) {
  if (ownerUid !== uid) throw new Error("Listing not found");
  if (status === "REMOVED")
    throw new Error("This listing was removed by an administrator.");
}
