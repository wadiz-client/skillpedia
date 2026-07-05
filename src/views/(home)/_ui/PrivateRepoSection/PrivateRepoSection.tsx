'use client';

import { Box, Section, SectionIntro } from '@primer/react-brand';

export const PrivateRepoSection = () => {
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
            사내 저장소 스킬을
            <br />팀 안에서 안전하게
          </SectionIntro.Heading>
          <SectionIntro.Description>
            사내 인프라에 직접 설치해서 운영해 보세요. 외부에 공개하지 않고 사내 저장소의 스킬 문서를
            안전하게 구조화할 수 있습니다.
          </SectionIntro.Description>
          <SectionIntro.Link href="#">가이드 보러 가기</SectionIntro.Link>
        </SectionIntro>
      </Box>
    </Section>
  );
};
