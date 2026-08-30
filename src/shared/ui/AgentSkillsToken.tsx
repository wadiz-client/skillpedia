import { Token } from '@primer/react';
import type { TokenProps } from '@primer/react';

import { AgentSkillsSymbolMark } from './AgentSkillsSymbolMark';

interface AgentSkillsTokenProps {
  size?: TokenProps['size'];
  text: TokenProps['text'];
}

export const AgentSkillsToken = ({ size, text }: AgentSkillsTokenProps) => {
  return (
    <Token
      as="a"
      href="https://agentskills.io"
      rel="noreferrer"
      size={size}
      target="_blank"
      text={
        <>
          <AgentSkillsSymbolMark style={{ verticalAlign: '-0.15em', marginInlineEnd: '0.25em' }} />
          {text}
        </>
      }
    />
  );
};
