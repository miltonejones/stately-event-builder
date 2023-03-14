
export const roomRecurse = (rooms, parent = 0, indent = 0, out = []) => {
  const kinder = rooms.filter((f) => f.RoomFk === parent);
  kinder.map((kind) => {
    out.push({ ...kind, indent });
    return roomRecurse(rooms, kind.ID, indent + 4, out);
  });
  return out;
};