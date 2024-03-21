import React from 'react';

function ChildComponent(props) {
  // Further processing of the memberNames array
  const processedNames = props.memberNames.map(name => name);

  return (
    <div>
      <h2>Processed Member Names:</h2>
      <ul>
        {processedNames.map((name, index) => (
          <li key={index}> {name} </li>
        ))}
      </ul>
    </div>
  );
}

export default ChildComponent;
