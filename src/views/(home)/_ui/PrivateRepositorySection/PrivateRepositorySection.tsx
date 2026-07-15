'use client';

import { Box, Section, SectionIntro } from '@primer/react-brand';
import { useTranslations } from 'next-intl';

export const PrivateRepositorySection = () => {
  const t = useTranslations('HomePage.PrivateRepositorySection');

  return (
    <Section as="section" backgroundColor="subtle" data-color-mode="dark">
      <Box
        paddingBlockEnd={80}
        paddingBlockStart={80}
        paddingInlineEnd={40}
        paddingInlineStart={40}
      >
        <SectionIntro>
          <SectionIntro.Label>Private</SectionIntro.Label>
          <SectionIntro.Heading size="2" weight="extrabold">
            {t.rich('title', {
              br: () => {
                return <br />;
              },
            })}
          </SectionIntro.Heading>
          <SectionIntro.Description>{t('description')}</SectionIntro.Description>
          <SectionIntro.Link href="#">{t('link')}</SectionIntro.Link>
        </SectionIntro>
      </Box>
    </Section>
  );
};
