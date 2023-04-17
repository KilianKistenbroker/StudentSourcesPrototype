const Notes = ({ notesData, setNotesData }) => {
  return (
    <textarea
      id="notesText"
      type="text"
      value={notesData}
      placeholder="Add notes here"
      onChange={(e) => setNotesData(e.target.value)}
    />
  );
};

export default Notes;
