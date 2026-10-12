import { Children, cloneElement, isValidElement, type CSSProperties, type ReactNode } from 'react';

type WordsProps = { children: ReactNode; delay?: number };

export function Words({ children, delay = 0 }: WordsProps) {
  let index = 0;

  const split = (node: ReactNode): ReactNode => {
    if (typeof node === 'string') {
      return node.split(/(\s+)/).map((part, i) =>
        part.trim() ? (
          <span key={i} className="word" style={{ '--i': index++ } as CSSProperties}>{part}</span>
        ) : (
          part
        ),
      );
    }
    if (isValidElement<{ children?: ReactNode }>(node) && node.props.children != null) {
      return cloneElement(node, undefined, Children.map(node.props.children, split));
    }
    return node;
  };

  return <span style={{ '--words-delay': `${delay}ms` } as CSSProperties}>{Children.map(children, split)}</span>;
}
