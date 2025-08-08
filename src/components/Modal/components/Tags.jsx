const Tags = (props) => {
  return (
    <div className="tags group">
      <div className={`tag rounded h-8 m-1 px-2 py-1 ${props.tagColor}`}>
        <span className="text-base text-white group-hover:opacity-0 transition-opacity duration-200">
          {props.tagName}
        </span>
      </div>
    </div>
  );
};

export default Tags;
