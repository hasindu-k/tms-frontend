export const renderColumnHeader = (
  { title },
  { removeColumn, renameColumn, addCard }
) => {
  return (
    <div className="text-lg font-bold text-gray-800 p-2 rounded-t-lg flex justify-between items-center m-1">
      <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
      <div>
        <button
          type="button"
          onClick={removeColumn}
          className="text-red-500 hover:text-red-700"
        >
          🗑️ Remove
        </button>
        <button
          type="button"
          onClick={() => renameColumn(prompt("Enter new title:") || title)} // Prompt for a new title
          className="text-blue-500 hover:text-blue-700 ml-2"
        >
          ✏️ Rename
        </button>
        <button
          type="button"
          onClick={() =>
            addCard({ id: `card-${Date.now()}`, title: "New Card" })
          } // Add card here
          className="text-green-500 hover:text-green-700 ml-2"
        >
          ➕ Add Card
        </button>
      </div>
    </div>
  );
};
