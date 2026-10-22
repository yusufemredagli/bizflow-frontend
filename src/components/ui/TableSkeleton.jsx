function TableSkeleton({
  rows = 6,
  columns = 7
}) {
  return (
    <>
      {Array.from({
        length: rows
      }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({
            length: columns
          }).map((_, columnIndex) => (
            <td key={columnIndex}>
              <div className="skeleton-line" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

export default TableSkeleton