declare module 'react-native-syntax-highlighter' {
  import type { ComponentType, ReactNode } from 'react';
  import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface NativeSyntaxHighlighterProps {
    children?: ReactNode;
    language?: string;
    style?: Record<string, Record<string, string | number>>;
    customStyle?: StyleProp<TextStyle | ViewStyle>;
    fontFamily?: string;
    fontSize?: number;
    highlighter?: 'highlightjs' | 'prism';
    PreTag?: ComponentType<any>;
    CodeTag?: ComponentType<any>;
    [key: string]: unknown;
  }

  const NativeSyntaxHighlighter: ComponentType<NativeSyntaxHighlighterProps>;

  export default NativeSyntaxHighlighter;
}

declare module 'react-syntax-highlighter/styles/hljs/*' {
  const style: Record<string, Record<string, string | number>>;
  export default style;
}
