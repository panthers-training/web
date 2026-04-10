declare namespace Typography {
  type HeadingLevel = '1' | '2' | '3' | '4' | '5' | '6';
}

declare namespace List {
  type Type = 'unordered' | 'ordered';
  type Element = 'list' | 'item';
  type Style = 'disc' | 'decimal' | 'none';
}

declare namespace astroHTML.JSX {
  interface HTMLAttributes<T = Record<string, unknown>> {
    'data-list-style'?: List.Style;
    'data-list-element'?: List.Element;
    'data-typography-heading-level'?: Typography.HeadingLevel;
  }

  interface IntrinsicAttributes {
    [key: string]: unknown
  }
}