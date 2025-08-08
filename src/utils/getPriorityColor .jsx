export const getPriorityColor = (priority) => {
  const backgroundColors = {
    1: "bg-green-50/50",
    2: "bg-blue-50/50",
    3: "bg-red-50/50",
  };

  const labelColors = {
    1: "bg-green-500",
    2: "bg-blue-500",
    3: "bg-red-500",
  };

  return {
    background: backgroundColors[priority] || "bg-gray-50/50",
    label: labelColors[priority] || "bg-gray-500",
  };
};
