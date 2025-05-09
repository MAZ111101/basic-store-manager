type ItemProps = {
    id: number;
    name: string;
    price: number;
    onDelete?: (id: number) => void;
    onToggleSelect?: (id: number) => void;
    selected?: boolean;
    selectable?: boolean;
  };
  
  export default function ItemCard({
    id,
    name,
    price,
    onDelete,
    onToggleSelect,
    selected = false,
    selectable = false,
  }: ItemProps) {
    return (
      <div className="flex justify-between items-center border p-3 rounded-lg shadow-sm mb-2">
        <div className="flex items-center gap-3">
          {selectable && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => onToggleSelect?.(id)}
            />
          )}
          <span>
            <strong>{name}</strong> — ${price.toFixed(2)}
          </span>
        </div>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        )}
      </div>
    );
  }
  