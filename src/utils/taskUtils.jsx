export const getStatusByColumnId = (columnId) => {
  switch (columnId) {
    case 1:
      return "todo";
    case 2:
      return "in-progress";
    case 3:
      return "completed";
    default:
      return "";
  }
};
