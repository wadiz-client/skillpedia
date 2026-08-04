import { Token } from '@primer/react';
import type { TokenProps } from '@primer/react';

import { ClaudeCodeSymbolMark } from './ClaudeCodeSymbolMark';

interface ClaudeCodeTokenProps {
  size?: TokenProps['size'];
  text: TokenProps['text'];
}

export const ClaudeCodeToken = ({ size, text }: ClaudeCodeTokenProps) => {
  return (
    <Token
      as="span"
      size={size}
      text={
        <>
          <ClaudeCodeSymbolMark style={{ verticalAlign: '-0.15em', marginInlineEnd: '0.25em' }} />
          {text}
        </>
      }
    />
  );
};
