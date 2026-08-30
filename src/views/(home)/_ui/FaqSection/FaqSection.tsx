'use client';

import { AnimationProvider, Box, FAQ, Section } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

import { AgentSkillsToken } from '@/shared/ui';

interface FaqItem {
  answer: string;
  question: string;
}

export const FaqSection = () => {
  const t = useTranslations('HomePage.FaqSection');
  const items = t.raw('items') as FaqItem[];

  return (
    <Section
      as="section"
      paddingBlockEnd="spacious"
      paddingBlockStart="spacious"
    >
      <Box
        paddingInlineEnd={40}
        paddingInlineStart={40}
      >
        <AnimationProvider animationTrigger="on-visible">
          <FAQ
            animate={{
              variant: 'slide-in-up',
            }}
          >
            <FAQ.Heading
              as="h2"
              weight="bold"
            >
              {t('title')}
            </FAQ.Heading>
            {items.map((item, index) => {
              return (
                <FAQ.Item
                  key={item.question}
                  open={index === 0}
                >
                  <FAQ.Question>{item.question}</FAQ.Question>
                  <FAQ.Answer>
                    <p>
                      {t.rich(`items.${index}.answer`, {
                        a: (chunks) => {
                          return (
                            <a
                              href="https://agentskills.io/clients"
                              rel="noreferrer"
                              target="_blank"
                            >
                              {chunks}
                            </a>
                          );
                        },
                        agentSkills: (chunks) => {
                          return (
                            <AgentSkillsToken
                              size="medium"
                              text={chunks}
                            />
                          );
                        },
                        code: (chunks) => {
                          return <code>{chunks}</code>;
                        },
                      })}
                    </p>
                  </FAQ.Answer>
                </FAQ.Item>
              );
            })}
          </FAQ>
        </AnimationProvider>
      </Box>
    </Section>
  );
};
