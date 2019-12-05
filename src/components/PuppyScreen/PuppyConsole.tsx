import React, { CSSProperties } from 'react';
import { StringElement, ConsoleValue } from '../../logic/puppy';
import './PuppyConsole.css';

type LineProps = {
  elements: StringElement[];
};

const Line: React.FC<LineProps> = (props: LineProps) => {
  const create_span = (e: StringElement, i: number) => {
    const css: CSSProperties = {};
    if (e.color) {
      css.color = e.color;
    }
    if (e.backgroundColor) {
      css.backgroundColor = e.backgroundColor;
    }
    return (
      <span key={i} style={css}>
        {e.value}
      </span>
    );
  };
  return (
    <div className="PuppyConsoleLine">
      <span>{props.elements.map((e, i) => create_span(e, i))}</span>
    </div>
  );
};

export type PuppyConsoleProps = {
  value: ConsoleValue;
};

const PuppyConsole: React.FC<PuppyConsoleProps> = (
  props: PuppyConsoleProps
) => {
  return (
    <div className="PuppyConsole">
      {props.value.map((elements, i) => (
        <Line key={i} elements={elements} />
      ))}
    </div>
  );
};

export default PuppyConsole;
